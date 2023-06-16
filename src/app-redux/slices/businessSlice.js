import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import status from '../../constants/status'
import BusinessServices from '../../app-redux/services/BusinessServices'
import message from '../../constants/message'

const initialState = {
    history: {
        data: [],
        status: status.idle,
        message: '',
    },
}

export const getHistoryBusiness = createAsyncThunk(
    'business/history',
    async params => {
        const res = await BusinessServices.getHistory(params)
        return res.data
    }
)

export const businessSlice = createSlice({
    name: 'business',
    initialState,
    extraReducers: builder => {
        builder
            .addCase(getHistoryBusiness.pending, (state, action) => {
                state.history.status = status.fetching
                state.history.message = ''
            })
            .addCase(getHistoryBusiness.fulfilled, (state, action) => {
                state.history.status = status.ready
                state.history.message = message.success
                state.history.data = action.payload.data
            })
            .addCase(getHistoryBusiness.rejected, (state, action) => {
                state.history.status = status.error
                state.history.message = action.error.message
            })
    }
})

export const { history } = businessSlice.actions

export default businessSlice.reducer