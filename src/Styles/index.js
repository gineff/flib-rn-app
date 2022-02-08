import {Colors} from './colors'
import {Dimensions} from "react-native";
export {Colors}

export const dimensions = {
  height: Dimensions.get('window').height,
  width: Dimensions.get('window').width
}

export const containerWidth = dimensions.width> 700? 700 : "100%";