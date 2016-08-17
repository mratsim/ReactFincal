import { StyleSheet } from 'react-native';

var Style = StyleSheet.create({
    rootContainer: {
        flex: 1 /* flex: 1 - full width and height */
    },

    displayContainer: {
        flex: 2, /* flex: 2 20% root container */
        backgroundColor: '#193441',
        justifyContent: 'center'
    },

    displayText: {
        color: 'white',
        fontSize: 38,
        fontWeight: 'bold',
        textAlign: 'right',
        padding: 20
    },

    inputContainer: {
        flex: 8, /* flex: 8 80% root container */
        backgroundColor: '#3E606F'
    },

    inputButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: '#91AA9D'
    },

    inputButtonText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white'
    },

    inputButtonHighlighted: {
        backgroundColor: '#193441'
    },

    inputRow: {
    flex: 1,
    flexDirection: 'row'
    }


});

export default Style;
