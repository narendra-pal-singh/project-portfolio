import React, { Component } from 'react'
import PDF_ICON from '../../assets/images/pdf_icon.png'
import uploadIcon from '../../assets/images/upload_pan.png'
import selectedMark from '../../assets/images/selected.png'
export default class AadharCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            errorMsg: "",
            aadhar_no: "",
            selectedFrontDoc: "",
            selectedBackDoc: "",
        };
        this.browserFrontDoc = React.createRef();
        this.browserBackDoc = React.createRef();
    }
    getData = async () => {
        //setIP(res.data.IPv4)
    }
    handleChange = input => e => {
        e.preventDefault();
        this.setState({ [input]: e.target.value, errorMsg: "" });
    }
    onFileChange = input => e => {
        e.preventDefault();
        //this.setState({ selectedDoc: e.target.files[0] });
        //console.log('onFileChange',e.target.files.length)
        if (e.target.files.length > 0)
            this.setState({ [input]: e.target.files[0], errorMsg: "" });
    };
    uploadDoc = () => {
        const { aadhar_no, selectedFrontDoc, selectedBackDoc } = this.state;
        if (aadhar_no === "" && selectedFrontDoc === "") {
            this.setState({ errorMsg: "Please enter Aadhar Number or Upload Document." });
            return false;
        }
        //Type, DocNo, FrontDoc, BackDoc, Redirect
        this.props.verifyDoc("aadhar_card", aadhar_no, selectedFrontDoc, selectedBackDoc, "aadhar_otp");
    }
    viewFileType = (selectedDoc) => {
        //const { selectedDoc } = this.state;
        let allowedExtension = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp'];
        if (selectedDoc && selectedDoc !== null && selectedDoc !== "") {
            if (allowedExtension.indexOf(selectedDoc.type) > -1) {
                return URL.createObjectURL(selectedDoc);
            } else if (selectedDoc.type === "application/pdf") {
                return PDF_ICON;
            } else {
                this.setState({ errorMsg: "Invalid Document" });
                return false;
            }
        } else {
            return false;
        }
    }
    render() {
        const { isLoaded, pData } = this.props;
        const { selectedFrontDoc, selectedBackDoc, errorMsg } = this.state;
        console.log('selectedFrontDoc', selectedFrontDoc);
        return (
            <div>
                {
                    (this.viewFileType(selectedFrontDoc) !== false) ? <img src={this.viewFileType(selectedFrontDoc)} className="uploadView" /> : null
                }
                <p className="head_text"><strong>{pData.pageTitle}</strong></p>

                <p>
                    <input type="file" accept="image/*" className="hide_file"
                        ref={this.browserFrontDoc}
                        onChange={this.onFileChange('selectedFrontDoc')}
                    />
                    <button className={'btn verify_btn ' + (selectedFrontDoc !== '' ? ' btnactive' : '')}
                        onClick={() => { this.browserFrontDoc.current.click() }}>
                        <img src={uploadIcon} className="uploadIcon" />Upload Aadhar</button>
                    {/* <img src={selectedMark} className="selectedMark" /> */}
                </p>
                <p className="verifyOpt"><sup>*</sup> Photo/Document should not be blurred</p>
                <p className="orSeperate">Or</p>
                <input type="text" className="form-control form_input" placeholder="Enter Aadhar Number"
                    maxLength="12"
                    onChange={this.handleChange('aadhar_no')}
                /><br />
                <div className={"error " + (errorMsg !== "" ? " show " : "")}>{errorMsg}</div>
                <p><button className="btn app_btn" onClick={() => this.uploadDoc()}>Submit</button></p>
                {
                    (isLoaded)
                        ?
                        <div style={{ background: '#444', color: '#fff' }}>Please wait...</div>
                        :
                        null
                }
            </div>
        )
    }
}
