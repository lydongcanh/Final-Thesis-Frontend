import React, { useState } from "react";
import { Layout, Card, Button, Icon } from "@ui-kitten/components";
import { ProductService } from "../../../../core/services";
import ManagementTemplateScreen from "./ManagementTemplateScreen";
import { ManagementTypes } from "../../../types";
import { ProductVerticalListItem } from "../../../components/products";

export default function ProductManagementScreen({ navigation, route }) {

    const category = route ? route.params.category : null;
    const [data, setData] = useState([]);

    if (category)
        navigation.setOptions({ title: category.name });
    
    async function loadProductsAsync() {
        if (category) {
            return await ProductService.getByCategoryId(category.id);
        } else {
            return await ProductService.getAll();
        }
    }

    function handleNewButton() {
        navigation.navigate("ProductDetails", { 
            mode: ManagementTypes.CREATE,
            category: category,
            products: data
        });
    }

    function handleConfigButton() {
        alert("Đang cập nhật");
    }

    function handleProductInfoButton(product) {
        navigation.navigate("ProductDetails", { 
            mode: ManagementTypes.UPDATE,
            product: product,
            products: data,
            category: category
        });
    }

    function handleProductDetailsButton(product) {
        navigation.navigate("ProductDetailsList", {
            product: product
        });
    }

    function getProductBottomPanel(product) {
        return (
            <Layout style={{ flex: 1, justifyContent: "flex-end", flexDirection: "row" }}>
                <Button 
                    appearance="ghost"
                    size="tiny" 
                    style={{ borderRadius: 20 }}
                    icon={style => <Icon {...style} name="edit-2-outline" />}
                    onPress={() => handleProductInfoButton(product)}
                >
                    Thông tin
                </Button>
                <Button 
                    appearance="ghost"
                    size="tiny" 
                    style={{ borderRadius: 20 }}
                    icon={style => <Icon {...style} name="inbox-outline" />}
                    onPress={() => handleProductDetailsButton(product)}
                >
                    Chi tiết
                </Button>
            </Layout>
        );
    }

    function getProductListItemUI(product) {
        return (
            <Card 
                style={{ margin: 16 }}
                disabled
                header={() => <ProductVerticalListItem product={product} showCategory={false} />}
            >
                {getProductBottomPanel(product)}
            </Card>
        );
    }

    return (
        <Layout style={{ flex: 1 }}>
            <ManagementTemplateScreen 
                loadDataAsync={loadProductsAsync}
                handleNewButton={handleNewButton}
                handleConfigButton={handleConfigButton}
                getListItemUI={getProductListItemUI}
                data={data}
                setData={setData}
                navigation={navigation}
                showSearchBox={false}
                showConfig={false}
            />
        </Layout>
    );
}