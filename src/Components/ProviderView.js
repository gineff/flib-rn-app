import {BooksProvider} from "../Provider/BooksProvider";
import BooksView from "./BooksView";

export default (props)=> {
  const { navigation, route} = props;
  const params = props.route.params;
  return (<BooksProvider {...params}>
    <BooksView navigation={navigation} route={route} />
  </BooksProvider>)
}