import React, { Component } from 'react';


import PopUpBox from './../../common/PopUpBox';

import { API_ROUTE, CS_ROUTE } from "../../data/Config"
import { getToken,setCurrentScreen } from "../../session/Control"

export default class Selfie extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // Initially, no file is selected
            selectedFile: null,
            base64: null,
            errorMsg: "",
            current_screen: "selfie",

            popUpData: {
                show: false,
                success: false,
                content: "",
            }
        };
    }

    componentDidMount() {
        //console.log("SELFIE PROPS", this.props);
    }

    onFileChange = event => {
        this.setState({ errorMsg: "" })
        this.setState({ selectedFile: event.target.files[0] });

    };

    convertBase64 = (file) => {

        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
                resolve(fileReader.result);
            }
            fileReader.onerror = (error) => {
                reject(error);
            }
        })
    }

    onFileUpload = async () => {

        if (this.state.selectedFile == null || this.state.selectedFile == "") {
            this.setState({ errorMsg: "Please select Photo." })
            return false;
        }

        // const base64 = await this.convertBase64(this.state.selectedFile)
        // console.log("base===", base64);

        const formData = new FormData();

        formData.append("type", "selfie");
        formData.append("document_file", this.state.selectedFile);

        const reqOptions = {
            method: 'POST',
            headers: {
                "Authorization" :"Bearer " + getToken()
            },
            body: formData
        };

        fetch(API_ROUTE.UPLOAD_DOC, reqOptions)
            //.then(response => response.json())
            .then(response => {
                if (response.ok) return response.json();
                return response.json().then(response => {
                  const error = response.message?response.message:"Server Issue, Please try later";
                  throw new Error(error)
                })
            })
            .then(async data => {
                const {message} = data;
                this.setState({ current_screen: 'dashboard', popUpData: { show: true, success: true, content: message } });

            }).catch(error => {
                
                this.setState({ popUpData: { show: true, success: false, content: 'Unable to Upload Selfie, Please try again' } });
                console.log("ERRROR", error);
            });

        //axios.post("api/uploadfile", formData);
    };

    closePopUP = () => {

        this.setState({ popUpData: { show: false } });

        if (this.state.popUpData.success === true) {
            const current_screen = this.state.current_screen;
            this.props.redirectPage(CS_ROUTE[current_screen]);
        }

    }


    render() {

        const { errorMsg, popUpData,selectedFile } = this.state;
        //var reader = new FileReader();
        //var url = reader.readAsDataURL(selectedFile);
        if(selectedFile!=null){
            console.log("IMAGE",selectedFile);
            var url = URL.createObjectURL(selectedFile);
        }
        
        
        return (
            <div>
                {
                    (selectedFile !== null) ? <img src={url} width="150px"/> : null
                }
                
                
                <p className="head_text"><strong>Take a Selfie</strong></p>
                <p className="input_head_p">The photo should not be blurry</p>

                <div className="input_div" id="myDIV">
                    <input type="file" accept="image/*" capture="camera" className="hide_file" ref={(ref) => this.takePhoto = ref} onChange={this.onFileChange} />
                    <p><button className="btn select_lang" onClick={() => { this.takePhoto.click() }}>Take Photo</button></p>
                    <br />
                    <p>
                        <input type="file" accept="image/*" className="hide_file" ref={(ref) => this.browserPhoto = ref} onChange={this.onFileChange} />
                        <button className="btn select_lang btn_p" onClick={() => { this.browserPhoto.click() }}>
                            Upload Selfie
                        </button>
                    </p>
                </div>
                <div className={"error " + (errorMsg !== "" ? " show " : "")}>{errorMsg}</div>
                <p><button className="btn app_btn" onClick={this.onFileUpload}>Next</button></p>

                <PopUpBox data={popUpData} closePopUP={this.closePopUP} />
            </div>
        )
    }
}
