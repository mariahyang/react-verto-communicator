import VertoService from '../../js/vertoService';
// validation steps include
const doValidation = (step=1) => {
  return dispatch => {
    switch (step) {
      case 1:
        dispatch(doingValidation(step, 'browser', 4));
        return dispatch(doBrowserCheck());
      case 2:
        dispatch(doingValidation(step, 'media', 4));
        return dispatch(doMediaCheck());
      case 3:
        dispatch(doingValidation(step, 'resolution', 4));
        return dispatch(doResolutionRefresh());
      case 4:
        dispatch(doingValidation(step, 'login', 4));
        return dispatch(doShowLogin());
    }

  }
}

const doingValidation = (step, title, number, errorObject) => {
  return {
    type: "VALIDATION",
    data: {
      current: step,
      title: title,
      number: number,
      errorObject
    }
  }
}

// browser
const doBrowserCheck = () => {
  return dispatch => {
    navigator.getUserMedia = navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    if (!navigator.getUserMedia) {
      dispatch({
        type: "BNS"
      });
    } else {
      dispatch(doValidation(2));
    }

  }
}

// media permissions
const doMediaCheck = () => {
  return dispatch => {
    VertoService.mediaPerm((status)=>{ //permissions
        //console.log('^^^^^', status);
        if (!status) {
          dispatch({
            type: "NO_MEDIA"
          });
        } else {
          dispatch(doValidation(3));
        }

    });
  }
};

// resolution
const doResolutionRefresh = () => {
  return dispatch => {
    dispatch(doingResolutionRefresh());
    VertoService.refreshDevices((status) => {
      //console.log('doRefresh Resolution: ', status);
      if (status){
        dispatch(doValidation(4));
      } else {
        dispatch({
          "type": "RESOLUTION_FAILED"
        });
      }

    });
  }
};

const doSpeedTest = () => {
  return dispatch => {
    dispatch(doingSpeedTest());
    VertoService.speedTest((data)=>{
      //console.log('doing speed test : ', data);
      //TODO
      dispatch(doSpeedTestResults(data))
    });
  }
};

const doSpeedTestResults = (data) => {
  const bw = {};
  bw.outgoingBandwidth = data.upKPS ?data.upKPS: undefined ;
  bw.incomingBandwidth = data.downKPS? data.downKPS: undefined;
  bw.vidQual = data.vidQual.label;
  //console.log('BBBSSSWWWW:', bw);
  return {
    "type": "SPEED_TEST",
    "data": bw
  }
};

const doingSpeedTest = () => {
  return {
    "type": "SPEED_TEST_INPROGRESS"
  }
};

const doingResolutionRefresh = () => {
  // rendering login through navigation
  return {
    "type": "RESOLUTION_REFRESH"
  }
};
//LOGIN
const doShowLogin = () => {
  return {
    "type": "SHOW_LOGIN"
  }
};
// called by click
const doSubmitLogin = (data) => {
  return dispatch => {
    // dispatching so we change from not authorized to pending
    dispatch(doingLogin(data));
    // Thunk here
    VertoService.login(dispatch, data);
    //dispatch(doVertoLogin(data)); // this sent the WS request
  };
};
// verto login callback
const doVertoLogin = (data) => {
  return dispatch => {
    //console.log('verto ....', data);
    //TODO figure this out if failed
    dispatch(doVertoLoginValid(data));
    dispatch(doSpeedTest());

  }
}
const doVertoLoginValid = (data) => {
  return {
    "type": "VERTO_LOGIN",
    "data": data
  };
}
const doingLogin = (data) => {
  return {
    type: "AUTH_SUBMIT_LOGIN",
    data: data
  }
}

// logOUT
// called from verto
const doLogOut = () => {
  return {
    "type": "LOGOUT"
  }
};
// called by client actions
const doSubmitLogOut = () =>{
  return dispatch => {
    VertoService.logout(dispatch);
    // dispatching so we change from not authorized to pending
    // Thunk here

  };
};


export { doValidation, doSubmitLogin, doShowLogin, doVertoLogin, doSubmitLogOut, doLogOut, doBrowserCheck };