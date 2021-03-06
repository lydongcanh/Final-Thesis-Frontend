import React, { useState } from "react";
import { Platform, StatusBar } from "react-native";
import { Layout, TabView, Tab } from "@ui-kitten/components";
import { CategoryManageView } from "../components/categories";
import { EmployeeManageView } from "../components/employees";

export default function ManagementScreen() {

    const [tabSelectedIndex, setTabSelectedIndex] = useState(0);

    return (
        <Layout style={{
            flex: 1,
            justifyContent: "flex-start",
            alignContent: "center",
            padding: 8,
            marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight
        }}>
            <TabView
                indicatorStyle={{ height: 1 }}
                onSelect={setTabSelectedIndex}
                selectedIndex={tabSelectedIndex}
                shouldLoadComponent={(index) => tabSelectedIndex === index}
                style={{ flex: 1 }}
            >
                <Tab title="Danh mục & Sản phẩm">
                    <CategoryManageView />
                </Tab>
                <Tab title="Nhân viên">
                    <EmployeeManageView />
                </Tab>
            </TabView>
        </Layout>
    )
}