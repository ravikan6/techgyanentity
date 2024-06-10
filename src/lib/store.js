import { configureStore } from '@reduxjs/toolkit';
import { studioDataReducer } from './reducers';

const studioStore = configureStore({
    reducer: {
        studioData: studioDataReducer,
        // Add reducers here
    },
    // Add any middleware or enhancers here
});

export default studioStore;