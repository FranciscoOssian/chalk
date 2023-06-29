import firestore from '@react-native-firebase/firestore';

interface ReportType {
  reason: string
}

async function reportUser(userId?: string, reportDetails?: ReportType): Promise<void | string> {
  if (!userId || !reportDetails) {
    throw new Error('Missing parameters. User Id and Report Details are required.');
  }

  try {
    const userReportRef = firestore()
      .collection('Users')
      .doc(userId)
      .collection('Reports');

    await userReportRef.add(reportDetails);
  } catch (firebaseError: any) {

    throw new Error(firebaseError.message);
  }
}

export default reportUser;
