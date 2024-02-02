import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const isAdm = async () => {
  try {
    const userId = auth().currentUser?.uid; // Obtém o ID do usuário atualmente autenticado
    if (!userId) return;
    const docSnapshot = await firestore().collection('AdminColec').doc('Doc').get();
    const admins = docSnapshot.data()?.admins || [];
    return admins.includes(userId);
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

export default isAdm;
