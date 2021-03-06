import React, { useState, useEffect } from "react";
import { FlatList } from "react-native";
import { Layout, Button } from "@ui-kitten/components";
import { ActivityIndicator } from "react-native-paper";
import { LoadErrorPanel } from "../others";
import { CategoryService } from "../../../core/services";

/**
 * @param param0 selectedCategory, setSelectedCategory
 */
export default function LeafCategorySelector({ selectedCategory, setSelectedCategory }) {

    const [categories, setCategories] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const [selectLevel, setSelectLevel] = useState(0);
    const [firstLevelCategory, setFirstLevelCategory] = useState();
    const [secondLevelCategory, setSecondLevelCategory] = useState();
    //const [thirdLevelCategory, setThirdLevelCategory] = useState();

    function initParentCategories(allCategories) {
        if (!selectedCategory || !allCategories || allCategories.lenght < 1)
            return;
        
        const secondLevelCategory = allCategories.find(c => c.id === selectedCategory.parentCategoryId);
        const firstLevelCategory = allCategories.find(c => c.id === secondLevelCategory.parentCategoryId);

        setFirstLevelCategory(firstLevelCategory);
        setSecondLevelCategory(secondLevelCategory);
        setSelectLevel(2);
    }

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        try {
            setIsLoading(true);
            const result = await CategoryService.getAllRoot();
            if (result.error) {
                console.log(result.error);
                setIsLoaded(false);
            } else {
                setCategories(result.data);
                setIsLoaded(true);
                if (selectedCategory) {
                    const allResult = await CategoryService.getAll();
                    initParentCategories(allResult.data);
                }
            }
        } catch(e) {
            console.log(e);
            setIsLoaded(false);
        } finally {
            setIsLoading(false);
        }
    }
 
    function handleCategoryButton(level, item, setCategoryFunc) {
        setCategoryFunc(item);
        setSelectLevel(level + 1);
    }

    function getCategoryButton(level, item, selectedCategory, setCategoryFunc) {
        return (
            <Button
                disabled={(level == 0 || level == 1) && (!item.childrenCategories || item.childrenCategories.lenght < 1)}
                size="tiny"
                style={{ margin: 8, borderRadius: 24 }}
                onPress={() => handleCategoryButton(level, item, setCategoryFunc)}
                status={(selectedCategory && item.id === selectedCategory.id) ? "info" : "basic"}
            >
                {item.name}
            </Button>
        );
    }

    function getListUI(level, categories, category, setCategory) {
        if (selectLevel < level)
            return;

        return (
            <FlatList
                horizontal
                data={categories.sort((a, b) => a.sortOrder > b.sortOrder)}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => getCategoryButton(level, item, category, setCategory)}
            />
        );
    }

    function getContentUI() {
        if (isLoading)
            return <ActivityIndicator style={{ flex: 1, margin: 8, alignContent: "center" }} />

        if (!isLoaded)
            return <LoadErrorPanel onReload={loadCategories} />

        const secondLevelCategories = firstLevelCategory ? firstLevelCategory.childrenCategories : null;
        const thirdLevelCategories = secondLevelCategory ? secondLevelCategory.childrenCategories : null; 

        return (
            <Layout style={{ flex: 1, justifyContent: "flex-start" }}>
                {getListUI(0, categories, firstLevelCategory, setFirstLevelCategory)}
                {getListUI(1, secondLevelCategories, secondLevelCategory, setSecondLevelCategory)}
                {getListUI(2, thirdLevelCategories, selectedCategory, setSelectedCategory)}
            </Layout>
        );
    }

    return (
        <Layout style={{ flex: 1 }}>
            {getContentUI()}
        </Layout>
    );
}