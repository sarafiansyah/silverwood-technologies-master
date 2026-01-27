"use client";

import React, { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store/redux/store";
import { Spin } from "antd";

export default function ReduxProvider({ children }: PropsWithChildren) {
    return (
        <Provider store={store}>
            <PersistGate loading={<Spin />} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    );
}
