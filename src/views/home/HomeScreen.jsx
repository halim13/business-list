import React, { useEffect, useRef, useState } from 'react'
import { FlatList, RefreshControl, View, StatusBar } from 'react-native'
import {
    Searchbar,
    Text,
    Button,
    RadioButton,
    TextInput,
    TouchableRipple,
    Portal,
    ActivityIndicator,
} from 'react-native-paper'
import { requestGet } from '../../utils/requestUtils'
import { convertCurrency } from '../../utils/commonUtils'
import lodash from 'lodash'
import { BASE_URL, HEADERS } from '../../constants/config'
import Icon from 'react-native-vector-icons/FontAwesome'
import RenderItem from '../../components/RenderItem'
import Modal from '../../components/Modal'
import sortBy from '../../constants/sortBy'

const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
}

const HomeScreen = ({ navigation }) => {
    const ref = useRef({
        page: 1,
        limit: 5,
        min: 0,
        max: 5,
    })

    const [loadMore, setLoadMore] = useState(false)
    const [filter, showFilter] = useState(false)
    const [originalData, setOriginalData] = useState([])
    const [data, setData] = useState([])
    const [search, setSearch] = useState('')
    const [location, setLocation] = useState('')
    const [sort_by, setSortBy] = useState('best_match')

    const setInput = setter => val => setter(val)
    const toggleFilter = () => setInput(showFilter)(!filter)

    useEffect(() => {
        fetchApi()
    }, [])

    const fetchApi = async () => {
        try {
            setLoadMore(true)
            const params = {
                location: location || 'NYC',
                sort_by,
                limit: 50,
            }
            setData([])
            await delay(100)
            const { businesses } = await requestGet(`${BASE_URL}/search`, params)
            setOriginalData(businesses)
            fetchData(businesses, true)
        } catch (error) {
            setLoadMore(false)
        }
    }

    const fetchData = async (original, refresh) => {
        const dataOri = original || originalData

        try {
            // setLoadMore(true)
            let result = []
            await delay(1000)
            if (data?.length < dataOri?.length) {
                const dataLength = dataOri.length
                const min = (ref.current.page - 1) * ref.current.limit
                const max = min + ref.current.limit
                const minSize = min
                const maxSize = max > dataLength ? dataLength : max

                if (!data?.length || refresh) {
                    result = dataOri.slice(0, 5)
                } else {
                    result = lodash.unionBy(data, dataOri.slice(minSize, maxSize), 'id')
                }
                setData(result)
            }
            setLoadMore(false)
        } catch (error) {
            setLoadMore(false)
        }
    }

    const getMore = () => {
        if (!loadMore && !search) {
            ref.current.page += 1
            setLoadMore(true)
            fetchData()
        }
    }

    clearSearch = () => {
        setInput(setSearch)('')
        setInput(setLocation)('')
        setInput(setSortBy)('best_match')
    }

    const renderEmpty = () => <Text style={{ fontWeight: 'bold', textAlign: 'center', marginTop: 8 }}>
        {!loadMore && 'No data available!'}
    </Text>

    const filteredData = data
        ?.filter(filter => filter
            ?.name
            ?.toLowerCase()
            ?.includes(search)
            || !!filter
                ?.categories
                ?.filter(fil => fil
                    ?.title
                    ?.toLowerCase()
                    ?.includes(search)
                )?.length
        )

    return (
        <View style={{ flex: 1 }}>
            <StatusBar translucent backgroundColor={'#0000'} />
            <View style={{ backgroundColor: '#eb443b', padding: 16, paddingTop: StatusBar.currentHeight }}>
                <Text style={{ color: '#fff', textAlign: 'center', fontSize: 25, marginBottom: 8 }}>Business List</Text>
                <Searchbar
                    style={{
                        borderRadius: 8,
                    }}
                    placeholder='Search'
                    onChangeText={setInput(setSearch)}
                    value={search.toLowerCase()}
                />
            </View>
            <View style={{ flexDirection: 'row', backgroundColor: '#e9e6dd', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16 }}>
                <Icon name='sliders' size={30} onPress={() => toggleFilter()} />
                {
                    !!data?.length && <Text style={{ marginLeft: 8 }}>{convertCurrency(filteredData?.length)} results</Text>
                }
            </View>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={filteredData || []}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item }) => <RenderItem item={item} navigation={navigation} />}
                onEndReached={() => getMore()}
                onEndReachedThreshold={0.01}
                ListEmptyComponent={renderEmpty}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => {
                            ref.current.page = 1
                            fetchApi()
                        }}
                    />
                }
            />
            <Modal
                isOpen={filter}
                onClosed={() => toggleFilter()}
            >
                <View>
                    <TextInput
                        mode='outlined'
                        label='location'
                        onChangeText={setInput(setLocation)}
                        value={location}
                        style={{ marginBottom: 16 }}
                    />
                    <Text style={{ fontWeight: 'bold' }}>Sort by</Text>
                    <View style={{ marginBottom: 16, flexDirection: 'row' }}>
                        {
                            sortBy.map((sort, i) => <TouchableRipple
                                key={i}
                                onPress={() => setInput(setSortBy)(sort.value)}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <RadioButton
                                        value={sort.value}
                                        status={sort_by === sort.value ? 'checked' : 'unchecked'}
                                        onPress={() => setInput(setSortBy)(sort.value)}
                                    />
                                    <Text>{sort.label}</Text>
                                </View>
                            </TouchableRipple>)
                        }
                    </View>
                    <View
                        style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Button
                            mode='contained'
                            onPress={() => {
                                ref.current.page = 1
                                fetchApi()
                            }}
                            style={{
                                borderRadius: 8,
                            }}
                            buttonColor='#0073bb'
                        >
                            Filter
                        </Button>
                        <Button
                            mode='contained'
                            buttonColor='#d32323'
                            style={{
                                borderRadius: 8,
                            }}
                            onPress={() => {
                                clearSearch()
                            }}
                        >
                            Clear
                        </Button>
                    </View>
                </View>
            </Modal>
            <Portal>

                <Modal
                    isOpen={!!loadMore}
                    backButtonClose={false}
                    backdropPressToClose={false}
                    position='center'
                    noHandle
                    entry={'top'}
                    style={{
                        width: 100,
                        height: 100,
                        borderRadius: 12,
                    }}
                >
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <ActivityIndicator size={'large'} color='#eb443b' />
                    </View>
                </Modal>
            </Portal>
        </View>
    )
}

export default HomeScreen
