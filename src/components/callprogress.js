import React from 'react';
import VertoBaseComponent from './vertobasecomponent';
import {AvatarSVG, DialPadIconSVG, MicrophoneIconSVG, PauseIconSVG, MuteMicrophoneIconSVG, PhoneIconSVG } from './svgIcons';

 const propTypes = {
   callData : React.PropTypes.object.isRequired,
   cbHangup : React.PropTypes.func.isRequired,
   cbHold:  React.PropTypes.func.isRequired,
   cbDTMF:  React.PropTypes.func.isRequired,
   cbMute:  React.PropTypes.func.isRequired,
   compStyle : React.PropTypes.object
};

class CallProgress extends VertoBaseComponent {
    constructor(props){
        super(props);
        this.state={startTime: Date.now(), timer: 0, status: 'trying'};
        this.padLeft = (s, len, c) =>{
              var c = c || '0';
              while (s.length < len) s = c+s;
              return s;
            }
    }

    componentWillReceiveProps(nextProp){
      //console.log('&&&&', nextProp);
      if (this.state.status != nextProp.callData.status ) {
        //console.log('------- changing ', nextProp.callData.status );
        this.interval = setInterval(()=>{
          const xTimer = Date.now() - this.state.startTime;
          //console.log('xXXXXX', xTimer);
          const hours = Math.floor(xTimer / (1000 * 60 * 60));
          const minutes = Math.floor( (xTimer - (hours * 1000 * 60 * 60))  / (1000* 60));
          const seconds = Math.floor( (xTimer - (hours * 1000 * 60 * 60) - (minutes * 1000 * 60 ))  / 1000);
          //console.log('xxxTIMER: ', xTimer, hours, minutes, seconds);
          const yTimer = this.padLeft(hours+"", 2)+':'+ this.padLeft(minutes+"", 2)+':'+ this.padLeft(seconds+"", 2)
          this.setState({ ...this.state, timer: yTimer });
        }, 1000);

        this.setState({ ...this.state, status: nextProp.callData.status, startTime: Date.now()});
      }
    }

    componentWillUnmount(){
      if (this.interval) {
        //console.log('clearing: ', this.interval);
        clearInterval(this.interval);
      }
    }

    getCompStyle() {
      return this.props.compStyle;
    }

    getDefaultStyle(styleName) {
      const styles = {
      };

      return (styles[styleName]);
    }

    render() {
      //console.log('<<<<<< CP: ', this.props.callData, this.state );

      return (
          <div style={{flexDirection: "column", display:"flex"}}>
            <div style={{flexDirection: "row", display:"flex"}}>
              <AvatarSVG svgStyle={{width: "100px", height: "100px", fillColor: "white"}} />
              <div style={{flexDirection: "column", display:"flex"}} >
                <div>{this.props.callData.destination}</div>
                <div>{this.state.status == 'active'? this.state.timer: 'Connecting ...' }</div>
              </div>
            </div>
            <div style={{backgroundColor: "green"}}>
              <DialPadIconSVG svgStyle={{width: "20px", height: "20px", fillColor: "white"}} />

              <span onClick={()=>{
                //console.log('mute Microphone clicked: ', this.props);
                this.props.cbMute(this.props.callData.callId);
              }}>
                <MicrophoneIconSVG svgStyle={{width: "20px", height: "20px", fillColor: "white"}} />
              </span>
              <span onClick={()=>{
                //console.log('mute Microphone clicked: ', this.props);
                this.props.cbHold(this.props.callData.callId);
              }}>
                <PauseIconSVG svgStyle={{width: "20px", height: "20px", fillColor: "white"}} />
              </span>
              <span onClick={()=>{
                //console.log('hangup clicked: ', this.props);
                this.props.cbHangup(this.props.callData.callId);
              }}>
                <PhoneIconSVG svgStyle={{width: "20px", height: "20px", fillColor: "white"}} />
              </span>
            </div>
          </div>
        );
    }
}

CallProgress.propTypes = propTypes;

export default CallProgress;
