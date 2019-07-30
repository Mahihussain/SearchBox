import React, { Component } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/jquery/dist/jquery.min.js';
import '../node_modules/popper.js/dist/umd/popper.min.js';
import '../node_modules/bootstrap/dist/js/bootstrap.min.js';
import axios from 'axios';
//import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor()
  {
    super();
    this.state = {
      search1: '',
      facet:[],
      results: [],
      total_result: 0
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onClicked = this.onClicked.bind(this);
    this.showProducts = this.showProducts.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    console.log(this.state.search1);
    
    axios.post('/',{query: this.state.search1}).then(res=>{

      console.log(res.data);
      this.setState({ 
        results: res.data.results,
        facet: res.data.facet,
        total_result: res.data.total_result
       });

    }).catch(err =>{

        Promise.reject(new Error('Failed Fetching Data!!'));
    });

    
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    //console.log(e.target.value);
  }
  onClicked(e)
  {
      console.log(e.target.value);
      if(this.state.search1=="")
      {
        axios.post('/filtered1',{parent_category: e.target.value}).then(res=>{

          console.log(res.data);
          this.setState({ 
            results: res.data.results,
            total_result: res.data.total_result
           });
    
        }).catch(err =>{
    
            Promise.reject(new Error('Failed Fetching Data!!'));
        });
    
      }
      else
      {
        axios.post('/filtered2',{query: this.state.search1, parent_category: e.target.value}).then(res=>{

          console.log(res.data);
          this.setState({ 
            results: res.data.results,
            total_result: res.data.total_result
           });
    
        }).catch(err =>{
    
            Promise.reject(new Error('Failed Fetching Data!!'));
        });
      }
  }
    showProducts(prod){

      let table = []
      let k=0;
      for (let i = 0; i < prod.length/3; i++) 
      {
          let children = []
          
          for (let j = 0; j < 3; j++) {
              if(prod[k])
              {
                  children.push(this.productComponent(prod[k]));
                  k++;
              }
          }
          table.push(<div className="row" key={ i }> { children } </div>)
      }
      return table

  }
    productComponent(child){


        return (<div className="col-md-4 product mb-3" key={ child.id }>
        <figure className="card shadow card-product" style={{ borderRadius: '1rem' }}>
            <div className="img-wrap"><img src={ child.image_url } alt={child.title} /></div>
            <figcaption className="info-wrap">
                    <h4 className="title">{ child.product_name }</h4>
                    <div className="price-wrap h5 pl-3">
                      <span className="price-new"><b>Price: { child.price }</b></span> 
                    </div> 
            </figcaption> 
        </figure>
    </div>);
    }

  render() {
    
    const facets = (

      <select className="form-control" style={{ width:'175px', overflow: 'hidden' }} onChange={(e)=>{this.onClicked(e)}}>
        <option value='' key="abcedefg">Select a Category</option>
        { 
          this.state.facet.map((cat, index)=>{
              //let rand=Math.random().toString(36).substring(2);
              let rand = Object.keys(cat).join('');
              //console.log(rand);
              return(<option key={index +''+rand}>{ rand }</option>);
          })
          
        }
        </select>

    );
    const res = (`Total Result: ${this.state.total_result}`);
  return (
    <div className="App">
        <form className="d-flex justify-content-center" onSubmit={this.onSubmit}>
            <div>
              { this.state.facet.length>0? facets:'' }
            </div>
            <div className="col-auto">
              <input type="text" className="form-control mb-2" id="search1" placeholder="Search Box" name="search1" value={this.state.search1}
              onChange={this.onChange} style={{ borderRadius:'2rem' }}/>
            </div>
            <button type="submit" className="btn btn-outline-info mb-2" style={{ borderRadius:'2rem' }}>Search</button>
        </form>
        <br/>
        <h2> { this.state.total_result>0 ? res:'' }</h2>
          
        <br/> <br/>
        <div className="container">
        { this.state.total_result>0 ? this.showProducts(this.state.results):'' }
        </div>
    </div>
  );
  }
}


export default App;
