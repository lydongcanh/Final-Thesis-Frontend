import React from "react";
import { Platform, StatusBar, Dimensions } from "react-native";
import { Layout, Text } from "@ui-kitten/components";
import { LineChart, PieChart } from "react-native-chart-kit";
import { Divider } from "react-native-paper";
import { EmployeeScreensHeader, Space } from "../../../components/others";

export default function AnalystScreen({ navigation }) {

    function getRevenueUI() {
        return (
            <Layout>
                <Text category="h6" style={{ marginLeft: 8 }}>Doanh thu theo quý</Text>
                <Divider style={{ margin: 8 }} />
                <LineChart
                    data={{
                        labels: [
                            'Th1',
                            'Th2',
                            'Th3',
                            'Th4',
                            'Th5',
                            'Th6',
                        ],
                        datasets: [
                            {
                                data: [25.35, 45.5, 28.1, 80.4, 99, 43.75],
                                strokeWidth: 2,
                            },
                        ],
                    }}
                    width={Dimensions.get('window').width - 16}
                    height={220}
                    chartConfig={{
                        backgroundColor: '#1cc910',
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#a7a7a7',
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                    }}
                    style={{
                        marginLeft: 8,
                        borderRadius: 16,
                    }}
                />
            </Layout>
        );
    }

    function getTrendingProductUI() {
        return (
            <Layout>
                <Text category="h6" style={{ marginLeft: 8 }}>Sản phẩm bán chạy</Text>
                <Divider style={{ margin: 8 }} />
                <PieChart
                    data={[
                        {
                            name: 'Áo thun',
                            unit: 230,
                            color: '#e3fdfd',
                        },
                        {
                            name: 'Áo khoác da',
                            unit: 186,
                            color: '#cbf1f5',
                        },
                        {
                            name: 'Đầm dạ hội',
                            unit: 99,
                            color: '#a6e3e9',
                        },
                        {
                            name: 'Khác',
                            unit: 678,
                            color: '#71c9ce',
                        },
                    ]}
                    width={Dimensions.get('window').width - 16}
                    height={220}
                    chartConfig={{
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                    }}
                    accessor="unit"
                    backgroundColor="transparent"
                    paddingLeft="16"
                    //absolute
                />
            </Layout>
        );
    }

    function getContentUI() {
        return (
            <Layout style={{ flex: 1 }}>
                {getRevenueUI()}
                <Space />
                {getTrendingProductUI()}
            </Layout>
        )
    }

    return (
        <Layout style={{ flex: 1, marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight }}>
            <EmployeeScreensHeader navigation={navigation} />
            {getContentUI()}
        </Layout>
    );
}