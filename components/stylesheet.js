import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    box: {
        backgroundColor: 'transparent',
        margin: 5,
        borderRadius: 10,
        borderWidth: 5,
        borderColor: '#412234',
        alignItems: 'center',
    },
    title: {
        color: '#ffffff'
    },
    text: {
        color: '#000000',
        margin: 15,
        fontSize: 28,
        fontWeight: 600,
    },
    view: {
        padding: 5,
        flex: 1,
        justifyContent: 'flex-start'
    },
    viewHome: {
        padding: 5,
        flex: 1,
        justifyContent: 'flex-start'
    },
    addContact: {
        marginHorizontal: 5,
        marginTop: 5,
        height: 55,
        width: undefined,
        aspectRatio: 1,
        alignSelf: 'center',
    },
    addContactBtn: {
        fontSize: 28,
        borderRadius: 5,
        alignSelf: 'flex-end',
        marginTop: 10,
        marginHorizontal: 10,
        marginBottom: 10,
        borderColor: '#000000',
        width: 50,
    },
    contactSearch: {
        width: 270,
        height: 50,
        marginRight: 20,
        color: '#2e4052',
        textAlign: 'center',
        fontSize: 28,
        placeholderTextColor: 'gray',
        backgroundColor: '#2e405210',
        borderRadius: 10,
    },
    contactOptions: {
        marginTop: -5,
        height: 50,
        width: undefined,
        aspectRatio: 0.2,
        alignSelf: 'center',
    },
    optionsPanelContacts: {
        position: 'absolute',
        backgroundColor: '#e7e8e9',
        height: 120,
        width: 200,
        right: 0, //-210,
        top: 140,
        borderBottomLeftRadius:20,
        borderTopLeftRadius:20,
    },
})

export default styles;