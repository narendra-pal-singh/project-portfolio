import React, { Component } from 'react'
import './index.css';

export default class index extends Component {

    constructor(props){
        
        super(props);

        this.state = {
            isLoaded:true,
            
            placeHolder:"",

            selectKey: 0,
            selectItem:"",

            rows: [],
            key:"",
            value:""
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event){
        this.props.onChange(event,event.target.value);
    }

    onChange = e => {
        
        const { items, item_key, item_data } = this.props

        console.log("ITEMs Props",this.props);

        const userInput = e.currentTarget.value

        var rows = [];
        if(items !== undefined){
            
            rows = items.filter(
            suggestion => 
                // {
                //     console.log("SEGGESTION",suggestion);
                    
                // }
            //suggestion(userInput.toLowerCase()) > -1
            //suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
            suggestion[item_data].toLowerCase().indexOf(userInput.toLowerCase()) > -1

            )
        }
        console.log("ITEM VALUE=",e.currentTarget.value);
        console.log("Filter Items=",e.currentTarget.value);
        
        //Pass value to getValue function
        this.props.getValue(-1,userInput);

        this.setState({
          rows,
          isLoaded: true,
          selectItem: e.currentTarget.value,
        });
        
      }
    
      onClick = e => {
        
        //Pass value to getValue function
        this.props.getValue(e.currentTarget.getAttribute('id'),e.currentTarget.innerText);
        //this.props.getValue(e.currentTarget.innerText);

        this.setState({
          rows: [],
          isLoaded: false,
          selectKey: e.currentTarget.getAttribute('id'),
          selectItem: e.currentTarget.innerText,
          
        })
      }


      
    render() {

        //console.log("PROPS===",this.props);
        // console.log("ThisState===",this.state);
        // console.log("ThisProps===",this.props);

        const {placeHolder,disabled,item_key,item_data,value,items} = this.props;

        
        
        const {onChange,onClick,state:{isLoaded,selectItem,rows}} = this;

        let itemListComponent;

        if(isLoaded && selectItem){
            if(rows.length){
                itemListComponent = (
                    <ul className="auto_list">
                        {rows.map( (item,key) =>{
                            return(
                                <li key={key} onClick={onClick} id={item[item_key]}>{item[item_data]}</li>
                            )
                        })}
                    </ul>
                )
            }
        }

        const itemValue = (value === 0 ) ? "" : selectItem;
        //const itemValue =  selectItem;

        console.log("selectItem==",selectItem);
        

        return (
            <div>
            <input className="form-control form_input search_box"
                autoComplete="chrome-off"
                placeholder={placeHolder}
                disabled={disabled}
                type="search" 
                value={itemValue} 
                onChange={onChange}
            />
            {itemListComponent}
            </div>
        )
    }
}
