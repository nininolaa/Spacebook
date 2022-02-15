import { StyleSheet } from "react-native"
export default StyleSheet.create({

        flexContainer: {
            flex: 1,
            backgroundColor: '#ffffff'
        },
    
        homeLogo: {
            flex: 30,
        },
        
        loginHeading:{
            fontSize: 20,
            fontWeight: 'bold',
        },
    
        loginButtonRow: {
            flex: 20,
            justifyContent: 'center',
            alignItems: 'center',
        },

        loginButton: {
            backgroundColor: '#f9943b',
            borderColor: '#f9943b',
            borderWidth: 2,
            borderRadius: 5,
            width: '30%',
            height:'50%',
            alignItems:'center',
        },
    
        loginButtonText: {
            fontSize: 20,
            textAlign: 'center',
            color: '#ffffff'
        },
    
        endTextRow: {
            flex: 15,
            justifyContent: 'space-evenly',
            alignContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            backgroundColor: '#ffaf7a'
        },

        loginInput:{
            borderWidth: 2,
            borderColor: '#d3d3d3',
            width: '80%',
            borderRadius: 5,
            marginBottom: '5%',         
        },

        linkText:{
            color: '#ffffff',
        }

        

})