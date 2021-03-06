// import stylesheet to get access to the styling
import { StyleSheet } from 'react-native';

export default StyleSheet.create({

  // --------------------- Default containers ------------------------------

  flexContainer: {
    flex: 1,
    backgroundColor: '#fdf6e4',
  },

  btnContainer1: {
    flex: 1,
    alignItems: 'center',
  },

  btnContainer2: {
    flex: 1,
    alignItems: 'center',
  },

  // --------------------- Homepage, Login and Register -------------

  homeLogo: {
    flex: 30,
  },

  loginHeading: {
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
    height: '50%',
    alignItems: 'center',
  },

  loginButtonText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#ffffff',
  },

  endTextRow: {
    flex: 15,
    justifyContent: 'space-evenly',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#ffaf7a',
  },

  loginInput: {
    borderWidth: 2,
    borderColor: '#d3d3d3',
    width: '80%',
    height: 50,
    borderRadius: 5,
    marginBottom: '5%',
  },

  linkText: {
    color: '#ffffff',
  },

  // --------------------- Default buttons -------------

  actionBtn: {
    fontSize: 20,
    textAlign: 'center',
    height: '80%',
    width: '100%',
    alignItems: 'center',
  },

  actionBtnOrange: {
    backgroundColor: '#ff6700',
  },

  actionBtnGreen: {
    backgroundColor: '#69b34c',
  },

  actionBtnRed: {
    backgroundColor: '#990f02',
  },

  actionBtnBlue: {
    backgroundColor: '#95d8eb',
  },

  actionBtnGrey: {
    backgroundColor: '#808080',
  },

  actionBtnLight: {
    textAlign: 'center',
    textTransform: 'uppercase',
    color: '#ffffff',
  },

  actionBtnDark: {
    textTransform: 'uppercase',
    color: '#000000',
  },

  navigateBtn: {
    padding: 3,
    backgroundColor: '#f87217',
    width: '40%',
    border: 2,
    borderRadius: 5,
  },

  navigateBtnText: {
    textAlign: 'center',
    color: 'white',
  },

  showEdit: {
    display: 'block',
  },

  hideEdit: {
    display: 'none',
  },

  // --------------------- User information texts -------------

  profileText: {
    fontWeight: 15,
    fontSize: 22,
  },

  profileMiniText: {
    fontSize: 15,
  },

  // --------------------- Setting screen  ------------
  updateInput: {
    borderWidth: 2,
    borderColor: '#ffbf99',
    width: '100%',
    borderRadius: 5,
    marginBottom: '2%',
    padding: 5,
  },

  // --------------------- Post feed  ------------

  postHeaderText: {
    border: 5,
    borderColor: 'black',
    color: '#411800',
    fontSize: 20,
    paddingBottom: 10,
    fontWeight: 50,
  },

  postBox: {
    border: 20,
    borderColor: 'black',
    backgroundColor: '#feddc9',
    marginBottom: 10,
    padding: 5,
  },

  postNameText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#391500',
  },

  postInfoText: {
    fontSize: 11,
    color: 'grey',
  },

  postMainText: {
    fontSize: 20,
    padding: 5,
    placeholderTextColor: 'black',
  },

  inPostContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
  },

  inPostImage: {
    flex: 1,
  },

  inPostHeader: {
    flex: 4,
  },

  findPostInput: {
    borderWidth: 3,
    borderColor: '#ffc9a9',
    borderRadius: 3,
    padding: 5,
    fontSize: 15,
  },

  addPostBtn: {
    backgroundColor: '#f9943b',
    borderColor: '#f9943b',
    borderWidth: 2,
    borderRadius: 5,
    width: '40%',
    height: 40,
    alignItems: 'center',
    marginTop: 10,
  },

  btnToEnd: {
    alignSelf: 'flex-end',
    paddingTop: 10,
  },

  // --------------------- Friend screen  ------------
  friendsBtn: {
    border: 5,
    borderRadius: 5,
    fontSize: 20,
    textAlign: 'center',
    height: '50%',
    width: '100%',
    alignItems: 'center',
  },

  // --------------------- Error messages  ------------
  loginErrorText: {
    color: '#B90E0A',
    marginBottom: 10,
    textAlign: 'left',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    alignItems: 'flex-start',
  },

  errorMessage: {
    fontSize: 20,
    color: '#B90E0A',
    justifyContent: 'center',
    padding: 20,
  },

  errorMessageSmall: {
    fontSize: 15,
    color: '#B90E0A',
    justifyContent: 'center',
    padding: 20,
  },

});
