import React, { useState, useEffect} from "react";
import { Layout, Modal, Icon, Button, Input, Card, CardHeader } from "@ui-kitten/components";
import { ActivityIndicator, Divider } from "react-native-paper";
import { FlatList } from "react-native";
import { LoadErrorPanel } from "../../../components/others";

/**
 * @param props loadDataAsync, handleNewButton, handleConfigButton, getListItemUI, navigation,
 */
export default function ManagementTemplateScreen ({ 
    loadDataAsync, handleNewButton, handleConfigButton = () => {}, getListItemUI, getConfigUI = () => {},
    data, setData, navigation, handleOnSearch = () => { },
    getOverrideListUI, showSearchBox = true, showConfig = true
}) {

    const [isLoading, setIsLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [isShowingConfig, setIsShowingConfig] = useState(false);

    useEffect(() => {
        callLoadDataAsync();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            callLoadDataAsync();
        });
      
        return unsubscribe;
    }, [navigation]);

    async function callLoadDataAsync() {
        try {
            setIsLoading(true);
            const result = await loadDataAsync();
            if (result.error) {
                console.log(error);
                setIsLoaded(false);
            } else {
                setData(result.data);
                setIsLoaded(true);
            }
        } catch (e) {
            console.log(e);
            setIsLoaded(false);
        } finally {
            setIsLoading(false);
        }
    }

    function getListUI() {
        if (getOverrideListUI)
            return getOverrideListUI();

        return (
            <FlatList
                data={data}
                keyExtractor={(_, item) => item.toString()}
                renderItem={({ item }) => getListItemUI(item)}
            />
        );
    }
    
    function getNewButtonUI() {
        if (handleNewButton) {
            return (
                <Button
                    appearance="ghost"
                    icon={(style) => <Icon {...style} name="plus-outline" />} 
                    style={{ marginLeft: 8, borderRadius: 50, flex: 1, alignSelf: "flex-end" }}
                    onPress={handleNewButton}
                />
            )
        }
    }

    function getConfigPanelUI() {
        function getSearchInput() {
            if (showSearchBox)
                return (
                    <Input 
                        icon={(style) => <Icon {...style} name="search-outline" />}
                        value={searchValue}
                        onChangeText={setSearchValue}
                        onIconPress={() => handleOnSearch(searchValue)}
                        style={{ borderRadius: 50, flex: 50, backgroundColor: "white" }}
                    />
                );
        }
        
        function getConfigButton() {
            if (showConfig)
                return (
                    <Button 
                        appearance="ghost"
                        icon={(style) => <Icon {...style} name="options-2-outline" />}
                        style={{ borderRadius: 50, flex: 1 }}
                        //onPress={handleConfigButton}
                        onPress={() => setIsShowingConfig(true)}
                    />
                )
        }

        return (
            <Layout>
                <Layout style={{ flexDirection: "row", marginTop: 8, marginLeft: 8, marginRight: 8, padding: 8 }}>
                    {getSearchInput()}
                    {getNewButtonUI()}
                    {getConfigButton()}
                </Layout>
                <Divider />
                <Modal 
                    onBackdropPress={() => setIsShowingConfig(false)}
                    backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    visible={isShowingConfig}
                >
                    <Card 
                        disabled
                        header={() => <CardHeader title="Lọc"/>}
                        footer={() => 
                            <Layout style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                <Button
                                    style={{ marginHorizontal: 4 }}
                                    size="small"
                                    onPress={() => { 
                                        setIsShowingConfig(false);
                                        handleConfigButton();
                                    }}
                                >
                                    OK
                                </Button>
                                <Button
                                    style={{ marginHorizontal: 4 }}
                                    size="small"
                                    status="basic"
                                    onPress={() => setIsShowingConfig(false)}
                                >
                                    Hủy
                                </Button>
                            </Layout>
                        }
                    >
                        {getConfigUI()}
                    </Card>
                </Modal>
            </Layout>
        );
    }

    function getContentUI() {
        if (isLoading)
            return <ActivityIndicator style={{ flex: 1, margin: 8, alignContent: "center" }} />

        if (!isLoaded)
            return <LoadErrorPanel onReload={callLoadDataAsync} />

        return (
            <Layout style={{ flex: 1 }}>
                {getConfigPanelUI()}
                {getListUI()}
            </Layout>
        );
    }

    return (
        <Layout style={{ flex: 1 }}>
            {getContentUI()}
        </Layout>
    );
}