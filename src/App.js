import './styles/generalStyles.css';
import Head from './components/common/head/Head';
import Footer from './components/common/footer/Footer';
import { RegisterPage }  from './pages/register/RegisterPage';
import Header from './components/common/header/Header';
import { useEffect, useRef, useState } from 'react';
import { Loader } from './components/common/loader/Loader';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import { ErrorBox } from './components/boxes/errorBox/ErrorBox';
import { MyError } from './utils/errorUtils';
import { BaseDialog, DialogOrigin, DialogType } from './components/dialogs/baseDialog/BaseDialog';
import { useDialog } from './components/dialogs/baseDialog/DialogProvider';
import { NotificationBox } from './components/boxes/notificationBox/NotificationBox';
import { ErrorBoxConfig } from './components/boxes/errorBox/errorBoxConfig';
import { VotingPage } from './pages/voting/VotingPage';
import { VotingPage as AdminVotingPage } from './pages/admin/voting/VotingPage';
import NotificationCollectionProvider from './components/common/notificationBanner/NotificationProvider';
import { useSession } from './components/common/session/SessionProvider';
import { LeaderboardPage } from './pages/leaderboard/LeaderboardPage';
import { DialogConfig } from './components/dialogs/baseDialog/dialogConfig';
import { DialogResult } from './components/dialogs/baseDialog/BaseDialog';
import { JudgeRequests } from './utils/requestUtils';
import { DialogUtils } from './components/dialogs/dialogUtils';
import { DocumentUtils } from './utils/document/documentUtils';
import { CountriesPage as AdminCountriesPage } from './pages/admin/countries/CountriesPage';
import { JudgesPage as AdminJudgesPage } from './pages/admin/judges/JudgesPage';

function App() {

  const {dialogOrigin, showDialog} = useDialog();
  const [title, setTitle] = useState("Eurovision");
  const [hideNavigation, setHideNavigation] = useState(false);

  const loaderRef = useRef(null);
  const registerRef = useRef(null);
  const votingRef = useRef(null);
  const adminVotingRef = useRef(null);

  const {connect, getURLParam} = useSession();

  useEffect(() => {
    handleURLParams();
    attachListeners();
    return () => {
      detachListeners();
    }
  }, []);

  const attachListeners = () => {
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);
  }

  const detachListeners = () => {
    window.removeEventListener('error', handleError);
    window.removeEventListener('unhandledrejection', handleError);
  }

  const handleError = (e) => {
    let config;

    if (e.reason instanceof MyError) {
      config = ErrorBoxConfig.createByMyError(e.reason);
    }
    else {
      let error = e.reason == null ? e.error : e.reason;
      config = new ErrorBoxConfig(error.message, "Contact Aggelos and reload the page.", error.stack, "GENERAL_ERROR", "Contact Aggelos and reload the page.");
    }

    showDialog(config);
  }

  const onPageLoaded = () => {
    loaderRef.current.revealScreen();
  }

  const getActivateJudgeDialogConfig = () => {
    const config = new DialogConfig("Activation success!", DialogType.SUCCESS);
    config.content = <p>Account activated successfully!</p>
    
    config.addButton("OK", DialogResult.OK, true);

    return config;
  }

  const getJudgeConnectionErrorDialogConfig = () => {
    const config = new DialogConfig("Connection problem", DialogType.ERROR);
    config.content = <p>Judge was not connected properly. Please redirect to the register page to connect!</p>;

    config.addButton("Register Page", DialogResult.CHOICE1, true);
    config.addButton("Close", DialogResult.CANCEL);

    return config;
  }

  const handleURLParams = () => {
    const judgeCode = getURLParam("judgeCode");
    const activationToken = getURLParam("activationToken");
    const isRegisterPage = window.location.pathname == "/";

    if (activationToken != null) {
      JudgeRequests.activateJudge(judgeCode, activationToken).then(response => {
        if (response.success) {
          showDialog(getActivateJudgeDialogConfig());
        }
        else {
          const config = DialogUtils.getErrorDialogConfig(response.jsonData.error.description);
          showDialog(config);
        }
      })
    }

    if (!isRegisterPage) {
      if (judgeCode != null) {
        connect(judgeCode);
      }
      else {
        showDialog(getJudgeConnectionErrorDialogConfig()).then(result => {
          if (result == DialogResult.CHOICE1) {
            DocumentUtils.redirectToPage("/");
          }
        })
      }
    }

  }

  return (
    <Router>
        <Loader ref={loaderRef}/>
        <Head title={title}/>
        <NotificationCollectionProvider>
          <Header hideNavigation={hideNavigation}/>
          <Routes>
            <Route path='/' element={<RegisterPage ref={registerRef} onPageLoaded={onPageLoaded}/>}/>
            <Route path='/voting' element={<VotingPage ref={votingRef} onPageLoaded={onPageLoaded}/>}/>
            <Route path='/leaderboard' element={<LeaderboardPage ref={votingRef} onPageLoaded={onPageLoaded}/>}/>
            <Route path='/admin/voting' element={<AdminVotingPage ref={adminVotingRef}/>}/>
            <Route path='/admin/countries' element={<AdminCountriesPage/>}/>
            <Route path='/admin/judges' element={<AdminJudgesPage/>}/>
          </Routes>
        </NotificationCollectionProvider>
          {dialogOrigin === DialogOrigin.BASEDIALOG && <BaseDialog/>}
          {dialogOrigin === DialogOrigin.NOTIFICATIONBOX && <NotificationBox/>}
          {dialogOrigin === DialogOrigin.ERRORBOX && <ErrorBox/>}
        <Footer/>
    </Router>
  );
}

export default App;
