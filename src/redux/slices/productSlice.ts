import { fetchApi } from "@/lib/fetchApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type Product = BaseModel & {
    productId?: string,
    name?: string,
    description?: string,
    price?: number,
    image?: string,
    rating?: number,
    sizeOptions?: ProductSize[],
    quantity?: number
}
export type ProductSize = BaseModel & {
    size?: string,
    quantity?: number
}
export type FilterProduct = PaginationState<Product[]> & {
    nameFilter?: string;
    emailFilter?: string;
    allLoading?: boolean;
}
const initialState = {
    productListState: {
        data: [],
        loading: null,
        error: null,
        pagination: {
            page: 1,
            pageSize: 10,
            totalCount: 0,
        }
    } as FilterProduct,
    singleProductState: {
        data: null,
        loading: null,
        error: null,
    } as BaseState<Product | null>,
};

export const fetchProductList = createAsyncThunk<any, { page?: number, pageSize?: number, size?: string } | void, { state: RootState }>(
    'user/fetchProductList',
    async (input, { dispatch, rejectWithValue, getState }) => {
        try {
            dispatch(fetchProductListStart())
            const response = await fetchApi(`product`, { method: 'GET' });
            if (response?.status) {

                dispatch(fetchProductListSuccess({ data: response.data.productList, totalCount: response.data.totalCount }));
                return response.data.productList
            } else {
                const errorMsg = response?.data?.message ?? 'Something went wrong!!';
                dispatch(fetchProductListFailure(errorMsg));
                return rejectWithValue(errorMsg);
            }

        } catch (error: any) {
            const errorMsg = error?.message ?? 'Something went wrong!!';
            dispatch(fetchProductListFailure(errorMsg));
            return rejectWithValue(errorMsg);
        }
    }
);

export const fetchSingleProduct = createAsyncThunk<any, string, { state: RootState }>(
    'product/fetchSingleProduct',
    async (productId, { dispatch, rejectWithValue }) => {
        try {
            dispatch(fetchSingleProductStart())
            const response = await fetchApi(`product/${productId}`, { method: 'GET' });
            if (response?.status) {
                dispatch(fetchSingleProductSuccess(response.data));
                return response.data;
            } else {
                const errorMsg = response?.data?.message ?? 'Something went wrong!!';
                dispatch(fetchSingleProductFailure(errorMsg));
                return rejectWithValue(errorMsg);
            }
        } catch (error: any) {
            const errorMsg = error?.message ?? 'Something went wrong!!';
            dispatch(fetchSingleProductFailure(errorMsg));
            return rejectWithValue(errorMsg);
        }
    }
);

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        fetchProductListStart(state) {
            state.productListState.loading = true;
            state.productListState.error = null;
        },
        fetchProductListSuccess(state, action) {
            state.productListState.loading = false;
            const { data, totalCount } = action.payload ?? {};
            state.productListState.data = data ?? [];
            state.productListState.pagination.totalCount = totalCount ?? 0;
            state.productListState.error = null;
        },
        fetchProductListFailure(state, action) {
            state.productListState.loading = false;
            state.productListState.error = action.payload;
        },
        fetchSingleProductStart: (state) => {
            state.singleProductState.loading = true;
            state.singleProductState.error = null;
        },
        fetchSingleProductSuccess: (state, action) => {
            state.singleProductState.loading = false;
            state.singleProductState.data = action.payload;
        },
        fetchSingleProductFailure: (state, action) => {
            state.singleProductState.loading = false;
            state.singleProductState.error = action.payload;
        },
    },
});

export const {
    fetchProductListFailure,
    fetchProductListStart,
    fetchProductListSuccess,
    fetchSingleProductFailure,
    fetchSingleProductStart,
    fetchSingleProductSuccess,
} = productSlice.actions;

export default productSlice.reducer;
