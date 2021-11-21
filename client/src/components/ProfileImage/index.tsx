import React from "react";
import { Image } from "react-native";

type Props = {
    uri: string;
    width: number;
    height: number;
    style: object
}

const ProfileImage: React.FC<Props> = ({ uri, width, height, style }) => (
    <Image
        source={{
            uri,
            width,
            height
        }}
        style={style}
    />
);

export default ProfileImage;