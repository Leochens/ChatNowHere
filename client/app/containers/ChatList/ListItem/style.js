import { StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    item: {
        height: 80,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        alignItems: 'center',
        flexDirection: 'row'
    },
    user_pic: {
        width: 64,
        height: 64,
        borderRadius: 32,
        marginRight: 8,
        marginLeft: 8
    },
    middle: {
        flex: 1
    },
    username: {
        fontSize: 16,
        color: '#666',
        paddingBottom: 8,
        paddingTop: 8
    },
    lastMsg: {
        flex: 1,
        fontSize: 12,
        color: '#999',
        paddingBottom: 8,
        paddingTop: 8
    },
    right: {
        marginRight: 16
    },
    bubble: {
        width: 16,
        height: 16,
        borderRadius: 8,
        textAlign: 'center',
        color: '#fff',
        lineHeight: 16,
        fontSize: 8,


    }
})

export default styles;