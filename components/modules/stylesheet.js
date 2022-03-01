import color from "color"
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
        },

        actionBtn: {
            fontSize: 20,
            textAlign: 'center',
            height:"80%",
            width:"100%",
            alignItems:'center',
        },
        btnContainer1:{
            flex: 1,
            alignItems:'center'
        },
        btnContainer2:{
            flex: 1,
            alignItems:'center'
        },

        actionBtnOrange: {
            backgroundColor: "#ff6700",
        },

        actionBtnGreen: {
            backgroundColor: "#69b34c",
        },

        actionBtnRed: {
            backgroundColor: '#990f02',
        },

        actionBtnBlue: {
            backgroundColor: '#95d8eb',
        },

        actionBtnLight: {
            textAlign:'center',
            textTransform: 'uppercase', 
            color: "#ffffff"
        },

        actionBtnDark: {
            textTransform: 'uppercase', 
            color: "#000000"
        },

        navigateBtn:{
            padding: 3,
            backgroundColor: "#f87217",
            width: '40%',
            border: 2,
            borderRadius: 5,
        },

        navigateBtnText:{
            textAlign: 'center',
            color: 'white',
        },

        showEdit: {
            display: 'block',
        },
    
        hideEdit:{
            display: 'none'
        },

        //Headings
        postHeaderText:{
            color: "#411800",
            fontSize: 20,
            paddingBottom: 10,
            fontWeight: 50,
        },

        //User text

        profileText:{
            fontWeight: 15,
            fontSize: 22,
         },

        profileMiniText:{
            fontSize: 15,
        },

        //setting screen 
        updateInput:{
            borderWidth: 2,
            borderColor: '#ffbf99',
            width: '100%',
            borderRadius: 5,
            marginBottom: '2%',  
            padding: 5,
        },

        //post wall

        postHeaderText:{
            border: 5,
            borderColor: 'black',
            fontSize: 25,
            paddingBottom: 10,
            fontWeight: 'bold',
        },

        postBox:{
            border: 20,
            borderColor: 'black',
            backgroundColor: '#feddc9',
            marginBottom: 10,
            padding: 5,
        },

        postNameText:{
            fontSize: 15,
            fontWeight: 'bold',
            color: "#391500"
        },

        postInfoText:{
            fontSize: 11,
            color: 'grey'
        },

        postMainText:{
            fontSize: 20,
            padding:5,
            placeholderTextColor: 'black',
        },

        inPostContainer:{
            flex: 1,
            flexDirection: 'row',
            padding: 10,
        },

        inPostImage:{
            flex: 1,
        },

        inPostHeader:{
            flex: 4,
        },

        findPostInput:{
            borderWidth: 3,
            borderColor: '#ffc9a9',
            borderRadius: 3,
            padding: 5,
            fontSize: 15,
        },

        addPostBtn:{
            backgroundColor: '#f9943b',
            borderColor: '#f9943b',
            borderWidth: 2,
            borderRadius: 5,
            width: '40%',
            height: 40,
            alignItems:'center',
            marginTop:10,
        },

        btnToEnd:{
            alignSelf: 'flex-end',
            paddingTop:10,
        },

        //friend Screen
        friendsBtn:{
            border: 5,
            borderRadius: 5,
            fontSize: 20,
            textAlign: 'center',
            height:"50%",
            width:"100%",
            alignItems:'center',
        },
        


})