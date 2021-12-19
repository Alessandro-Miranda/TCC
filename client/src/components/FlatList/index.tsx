import React from "react";
import { FlatList, StyleProp, ViewStyle } from "react-native";

type Props = {
    data: Object[];
    Component: React.FC<ComponentProps>;
    styles: StyleProp<ViewStyle>
}

type ComponentProps = {
    item: Object;
    index: number;
}

const List: React.FC<Props> = ({ data, Component, styles }) => (
    <FlatList
        data={data}
        renderItem={({ item, index }) => <Component item={item} index={index} />}
        keyExtractor={(_, index) => index.toString()}
        style={styles}
    />
)

export default List;