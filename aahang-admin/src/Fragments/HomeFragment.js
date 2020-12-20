import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Avatar, Backdrop, Container,CircularProgress, Fab , Dialog, Toolbar, IconButton,Slide,Button,FormControl,InputLabel,Select,MenuItem, TextField, Checkbox, FormControlLabel, Snackbar,  } from '@material-ui/core';
import BannerSlider from "../Components/BannerSlidder"
import ServiceView from '../Components/ServiceView';
import HorizontalScroller from '../Components/HorizontalScroller';
import StripAdView from '../Components/StripAdView';
import GridView from '../Components/GridView';
import { Category, Home , Add ,Close,Delete,ColorLens,} from "@material-ui/icons"
import { connect } from 'react-redux';
import { loadCategories, } from '../Components/Actions/categoryAction';
import categoryReducer from '../Components/Reducers/categoryReducer';
import {  loadCategoryPage } from '../Components/Actions/categoryPageAction';
import { firestore , storageRef} from '../firebase';



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

export class HomeFragment extends Component {
   
    constructor(props){
        super(props)
        this.state = {
            loading:true,
            value:0,
            Page:"HOME",
            addDialog: false,
            images: [],
            colors: [],
            selectedServices: [],
            positionError:"",
            layout_titleError:"",
            snackbar:"",
            Layout_Background:"ffffff",
            
            view_type:0,
        }
    }

    handleChange = (event, newValue) => {
        this.setState({
            value:newValue
        })
      };

         loadLatestService = () =>{
          firestore
          .collection("SERVICE PROVIDER")
          .orderBy('added_on',"desc").limit(8)
          .get()
          .then((querySnapshot) => {
              let servicelist = []
           if(!querySnapshot.empty)
           {
              querySnapshot.forEach((doc) => {
                let data = {
                  id : doc.id,
                  image :doc.data().service_provider_image_1,
                  title : doc.data().service_provider_name,
                  price : doc.data().service_charge,
                }
                
                 servicelist.push(data);
                });
                
           }
           this.setState({
             servicelist,
           })
            
      }).catch((error) =>{
          console.log(error);
        
      });
         };

         searchService = () =>{

          if(!this.state.search){
            this.loadLatestService();
            return;
          }

         
          
           let keywords = this.state.search.split(" ");

          firestore
          .collection("SERVICE PROVIDER")
          .where('tags','array-contains-any',keywords)
          .get()
          .then((querySnapshot) => {
              let servicelist = []
           if(!querySnapshot.empty)
           {
              querySnapshot.forEach((doc) => {
                let data = {
                  id : doc.id,
                  image :doc.data().service_provider_image_1,
                  title : doc.data().service_provider_name,
                  price : doc.data().service_charge,
                }
                
                 servicelist.push(data);
                });
                
           }
           this.setState({
             servicelist,
             searching:false
           })
            
      }).catch((error) =>{
          console.log(error);
          this.setState({
            searching:false
          })
        
      });
  
   
         };


        

      componentDidMount()
      {
          if(this.props.categories===null)
          {
              this.props.loadCategories(()=>{

                this.props.loadPage("HOME",()=>{

                    this.setState({loading: false})
                },()=>{
                    //////////error
                    this.setState({loading: false})
                });
                
              },()=>{
                         ////ERROR
                         this.setState({loading: false})
              });
          }else{
            this.setState({loading: false})
          }
      }

      onFieldChange = (e) =>{
        this.setState({
          [e.target.name] : e.target.value,
          
        });
      }

      removeImage = index =>{
         let images = this.state.images;
         let colors = this.state.colors;

        
         images.splice(index, 1);
         colors.splice(index, 1);
           
                 this.setState({
                    images,
                    colors,
                 })
      
      }

      uploadServiceSection = () => {
        this.setState({
          loading:true
        })
        let data = {
          view_type:this.state.view_type,
          layout_title:this.state.layout_title,
          Index:parseInt(this.state.position),
          layout_background:this.state.Layout_Background,
          services:this.state.selectedServices,
        }
        
        const onComplete = () =>{
          let sections = this.props.categoryPages[this.state.Page]
          sections.push(data);
          sections.sort((a,b)=>a.Index - b.Index)
          
           this.props.addsection(this.state.Page,sections)

           this.setState({
            position : null,
            images : [],
            view_type : 0,
            colors : [],
            loading:false,
            addDialog:false,
            selectedServices:[],
            layout_title:null,
            Layout_Background:null,

          });
        };
        firestore.collection("CATEGORIES").doc(this.state.Page).collection("PROMOTION")
        .add(data).
        then(function (doc) {
          data['id'] = doc.id;
          onComplete();
          
         })
        .catch((err)=>{
          this.setState({
            loading:false
          });
        });
      }

      save = () =>{

        this.setState({
          positionError:"",
          layout_titleError:"",
        })

         if(!this.state.position)
         {
           this.setState({
             positionError:"Required"
           })
          return;
         }
         
       switch(this.state.view_type)
       {
         case 0:
           if(this.state.images.length < 3){
             this.setState({
               snackbar:"Minimum 3 Images required",
             });
             return;
           }
           let Index = 0;
           let urls = [];
           this.setState({
             loading:true
           })
            this.uploadImages(this.state.images,Index,urls,()=>{
            
              let data = {
                view_type:0,
                number_of_banner:urls.length,
                Index:parseInt(this.state.position),
              }
              for(let x = 0;x < urls.length;x++)
              {
                data["banner_"+(x+1)] = urls[x]
                data["banner_"+(x+1)+"_background"] = this.state.colors[x]
              }
              const onComplete = () =>{
                let sections = this.props.categoryPages[this.state.Page];
                  sections.push(data);
                  sections.sort((a,b)=>a.Index - b.Index)
                
                 this.props.addsection(this.state.Page,sections)

                 this.setState({
                  position : null,
                  images : [],
                  view_type : 0,
                  colors : [],
                  loading:false,
                  addDialog:false,
                  selectedServices:[],
                  layout_title:null,
                  Layout_Background:null,
 
                });
              };
             
                firestore
                .collection("CATEGORIES")
                .doc(this.state.Page)
                .collection("PROMOTION")
                .add(data).
                then(function (doc) {
                  data['id'] = doc.id;
                  onComplete();
                 
                })
                .catch((err)=>{
                  this.setState({
                    loading:false
                  });
                });
            });
              
            
           break;
         case 1:
          if(this.state.images.length <1){
            this.setState({
              snackbar:" Images is required"
            })
            return;
          }
          let Index2 = 0;
          let urls2 = [];
          this.setState({
            loading:true
          })
           this.uploadImages([this.state.images[0]],Index2,urls2,()=>{
           
             let data = {
               view_type:1,
               strip_ad_banner:urls2[0],
               Index:parseInt(this.state.position),
               background:this.state.colors[0]
             }
             
             const onComplete = () =>{
               let sections = this.props.categoryPages[this.state.Page]
               sections.push(data);
               sections.sort((a,b)=>a.Index - b.Index)
               
                this.props.addsection(this.state.Page,sections)

               this.setState({
                 position : null,
                 images : [],
                 view_type : 0,
                 colors : [],
                 loading:false,
                 addDialog:false,
                 selectedServices:[],
                 layout_title:null,
                 Layout_Background:null,

               });
             };
             firestore.collection("CATEGORIES").doc(this.state.Page).collection("PROMOTION")
             .add(data).
             then(function (doc) {
              data['id'] = doc.id;
              onComplete();
              
             })
             .catch((err)=>{
               this.setState({
                 loading:false
               })
             })
           });
           break;
         case 2:
            if(!this.state.layout_title){
              this.setState({
                layout_titleError:"Required!"
              })
              return;
            }
            if(this.state.selectedServices.length < 1){
              this.setState({
                snackbar:"Please select at least 1 service"
              });
              return;
            }
              
              this.uploadServiceSection()
           break; 
         case 3:
          if(!this.state.layout_title){
            this.setState({
              layout_titleError:"Required!"
            })
            return;
          }
          if(this.state.selectedServices.length < 4){
            this.setState({
              snackbar:"Please select at least 4 service"
            })
            return;
          }
          this.uploadServiceSection()
           break; 
           default:  
       }

      }

      deleteImages = (images,index,onComplete) =>{
         const deleteAgain = (images,index,onComplete) =>
         this.deleteImages(images,index,onComplete);

         let splited_link = images[index].split("/");
         let name = splited_link[splited_link.length-1].split("?")[0].replace("banners%2F","");

         storageRef.child("banners/"+name).delete().then(()=>{

           index++;
          if(index < images.length){
          deleteAgain(images,index,onComplete);
          }else{
            onComplete();
          }

         }).catch(err=>{
          this.setState({loading:false})
         })
      }

      uploadImages = (images,index,urls,onCompleted) =>
      {
        const uploadAgain =  (images,index,urls,onCompleted)=>
        this.uploadImages(images,index,urls,onCompleted);
        let file = images[index]
          
          var ts = String(new Date().getTime()),
              i = 0,
              out = '';
      
          for (i = 0; i < ts.length; i += 2) {
              out += Number(ts.substr(i, 2)).toString(36);
          }
      
         let filename =  'banner' + out;
      

        var uploadTask = storageRef.child('banners/'+filename+'.jpg').put(file);

     uploadTask.on('state_changed', function(snapshot){
 
  var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  console.log('Upload is ' + progress + '% done');
  
}, function(error) {
  // Handle unsuccessful uploads
}, function() {
 
  uploadTask.snapshot.ref.getDownloadURL().then((downloadURL)=>{
      urls.push(downloadURL);
      index++;
      if(index < images.length){
        uploadAgain(images,index,urls,onCompleted);
      }else{
         onCompleted();
      }
  });
}
  );

};

    render() {
        return (
            <div>
            <Container maxWidth="md" fixed>
               
              <AppBar position="static" color="grey">
                <Tabs
                  value={this.state.value}
                  onChange={this.handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="scrollable auto tabs example"
                >
                  {this.props.categories?
                  this.props.categories.map((category)=>(
                       
                       <Tab 
                       icon={
                       <CategoryTab 
                       icon={category.icon} 
                       title={category.categoryName} 
                       
                       />
                     } 
                     onClick={e=>{
                         if(this.props.categoryPages[category.categoryName.toUpperCase()])
                         {
                            this.setState({
                                Page: category.categoryName.toUpperCase()
                            });
                         }
                         else{
                             this.setState({loading:true})
                            this.props.loadPage(category.categoryName.toUpperCase() ,
                            ()=>{

                                this.setState({loading: false,
                                    Page: category.categoryName.toUpperCase(),})
                            },()=>{
                                //////////error
                                this.setState({loading: false})
                            });
                         }
                        
                     }}
                     />
                  )): null
                    }
                </Tabs>
              </AppBar>
                
             {this.props.categoryPages
             ? this.props.categoryPages[this.state.Page].map((item,indexMain) => {
                 switch(item.view_type)
                 {
                     case 0:
                         let banners = [];
                         let images = [];
                         
                         for(let index = 1; 
                            index < (item.number_of_banner + 1); 
                            index++
                            )
                         {
                            const banner = item["banner_"+index];
                            const background = item["banner_"+index+"_background"];
                            banners.push({ banner , background });
                            images.push(banner);
                            
                         }
                        return <BannerSlider
                         delete={()=>
                          this.setState(
                            {
                            loading:true
                          },
                          this.deleteImages(images,0,()=>{
                           firestore.collection("CATEGORIES").doc(this.state.Page).collection("PROMOTION").
                           doc(item.id).delete().then(()=>{
                            this.props.categoryPages[this.state.Page].splice(indexMain,1);
                            this.setState({
                              loading:false
                            })
                           }).catch(err=>{
                             this.setState({
                               loading:false
                             })
                           })
                        }))} Images={banners} />;
                    case 1:
                        return<StripAdView 
                        delete={()=>
                          this.setState(
                            {
                            loading:true
                          },
                          this.deleteImages([item.strip_ad_banner],0,()=>{

                           firestore.collection("CATEGORIES").doc(this.state.Page).collection("PROMOTION").
                           doc(item.id).delete().then(()=>{
                            this.props.categoryPages[this.state.Page].splice(indexMain,1);
                            this.setState({
                              loading:false
                            })
                           }).catch(err=>{
                             this.setState({
                               loading:false
                             })
                           })
                        }))}
                        image={item.strip_ad_banner} 
                        background={item.background}/>;

                    case 2:

                    let servicesData = []

                    if(!item.loaded){
                        item.services.forEach((id,index) => {

                          firestore.collection("SERVICE PROVIDER").
                          doc(id).get().then(document=>{
                            if(document.exists) {
                            let serviceData = {
                              id:id,
                              title:document.data()["service_provider_name"],
                              subtitle:"",
                              image:document.data()["service_provider_image_1"],
                              price:document.data()["service_charge"],
                              
                            }
                            servicesData.push(serviceData)
                            if(index === item.services.length-1)
                            {
                              item.services = servicesData
                              item['loaded'] = true
                              this.setState({});
                            }
                          }
                          }).catch((err)=>{

                          });
                        
                        });
                      }

                        // let services = [];
                        // for(let index = 1; 
                        //     index < (item.number_of_services + 1); 
                        //     index++
                        //     )
                        //  {

                        //   let  data = {};
                        //    data['title'] =item['service_title_'+index]
                        //    data['subtitle'] =item['service_subtitle_'+index]
                        //    data['charge'] =item['service_charge_'+index]
                        //    data['image'] =item['service_image_'+index]
                        //    services.push(data)
                        //  
                       //   }
                        
                        return ( <HorizontalScroller
                           delete={() => this.setState({
                             loading:true
                           }), ()=> {
                             
                              firestore.collection("CATEGORIES").doc(this.state.Page).collection("PROMOTION").
                           doc(item.id).delete().then(()=>{
                            this.props.categoryPages[this.state.Page].splice(indexMain,1);
                            this.setState({
                              loading:false
                            })
                           }).catch(err=>{
                             this.setState({
                               loading:false
                             });
                           });
                        }}
                  
                           services={item.services} 
                           title={item.layout_title} 
                           background={item.layout_background}/>  );

                     case 3:

                      let gridservicesData = []

                      if(!item.loaded){
                          item.services.forEach((id,index) => {
  
                            if(index < 4){

                            firestore.collection("SERVICE PROVIDER").
                            doc(id).get().then(document=>{
                              if(document.exists) {
                              let serviceData = {
                                id:id,
                                title:document.data()["service_provider_name"],
                                subtitle:"",
                                image:document.data()["service_provider_image_1"],
                                price:document.data()['service_charge'],
                                
                              }
                              gridservicesData.push(serviceData)
                              if(index === 3)
                              {
                                item.services = gridservicesData
                                item['loaded'] = true
                                this.setState({});
                              }
                            }
                            }).catch((err)=>{
  
                            });
                            }
                          });
                        }
                                 return <GridView 
                                 delete={()=> this.setState({
                                  loading:true
                                }), ()=>{
                                  firestore.collection("CATEGORIES").doc(this.state.Page).collection("PROMOTION").
                               doc(item.id).delete().then(()=>{
                                this.props.categoryPages[this.state.Page].splice(indexMain,1);
                                this.setState({
                                  loading:false
                                })
                               }).catch(err=>{
                                 this.setState({
                                   loading:false
                                 });
                               });
                            }}
                                 services={item.services} 
                                   title={item.layout_title} 
                                   background={item.layout_background} />;
                     default:
                         break;
                 }
             }) 
             : null }
             <Fab color="primary" aria-label="add"onClick={(e)=>this.setState({
                  addDialog:true,
             })} style={{position:"fixed",bottom:"50px",right:"50px"}}>
             <Add />
             </Fab>            
              </Container>

              <Dialog 
              fullScreen 
              open={this.state.addDialog}
               onClose={e=>this.setState({
                   addDialog:false
               })} 
               TransitionComponent={Transition}>
            <AppBar>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={e=>this.setState({
                addDialog:false
            })} aria-label="close"> 
              <Close />
            </IconButton>
            <Typography variant="h6" >
              Add Section
            </Typography>
            <Button autoFocus color="inherit" style={{position:"absolute",right:0,}}
            onClick={ (e) => 
           this.save()
            }>
              save
            </Button>
          </Toolbar>
        </AppBar>
         <Toolbar/>
       <Box padding="16px">
           <FormControl>
        <InputLabel id="demo-simple-select-label">VIEW TYPE</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          onChange={(e) => { 
            console.log(this.state.images)
            this.onFieldChange(e)
             this.setState({
               colors:[],
               images:[],
               selectedServices:[],
             });
          }}
          name="view_type"
          defaultValue={0}
        >
          <MenuItem value={0}>BANNER SLIDER</MenuItem>
          <MenuItem value={1}>STRIP AD</MenuItem>
          <MenuItem value={2}>HORIZONTAL SCROLLER</MenuItem>
          <MenuItem value={3}>GRID VIEW</MenuItem>
        </Select>
       <br/>
        <TextField
          label="Position"
          id="outlined-size-small"
          variant="outlined"
          type="number"
          name="position"
          
          error={this.state.positionError !== ""}
          helperText={this.state.positionError}
          onChange={this.onFieldChange}
          size="small"
          margin="dense"
         
        />
        </FormControl>
        <br/>
        <Box display="flex" flexWrap="true">

          { this.state.images.map((item,index)=>(
           <Box margin="12px" >
            <img 
            src={ URL.createObjectURL(item) } 
            style={{height:"90px" ,
             width: this.state.view_type===0?"160px":this.state.view_type===1?"210":0 , 
             objectFit:"scale-down", 
             backgroundColor:this.state.colors[index],
            }}
            />
            <br/>
            <br/>
            <input 
            id={"contained-button-"+index} 
            type="color" 
            hidden
            onChange={e=>{
              let colors = this.state.colors;
              colors[index] = e.target.value;
              this.setState({
                colors
              })
            }}
            defaultValue="#000000"
            />
            <IconButton 
            aria-label="delete"
             onClick={(e)=>this.removeImage(index)}
            >
           <Delete />
           <br/>
         </IconButton>
            <label htmlFor={"contained-button-"+index}>
            <IconButton color="primary" aria-label="upload picture" component="span">
          <ColorLens />
        </IconButton>
      </label>
          </Box>
          ))}
        </Box>
        <br/>
        <input
        accept="image/*"
        id="contained-button-file"
        onChange={(e)=>{
         
          if( e.target.files &&  e.target.files[0] ){
            let images = this.state.images;
            let colors = this.state.colors;
             
            images.push( e.target.files[0]);
            colors.push("#ffffff");
            this.setState({
              images,
            });
            e.target.value = null;
          }
        }}
        name="images"
        hidden
        type="file"
      />
      {this.state.view_type === 0 && this.state.images.length < 8 ? (
      <label htmlFor="contained-button-file">
        <Button variant="contained" color="primary" component="span">
          Add image
        </Button>
      </label>
      ) : null
    }
          {this.state.view_type === 1 && this.state.images.length < 1 ? (
      <label htmlFor="contained-button-file">
        <Button variant="contained" color="primary" component="span">
          Add image
        </Button>
      </label>
      ) : null
    }
    <br/>
      { (this.state.view_type === 2 || this.state.view_type === 3) && 

      <div>
       <Box style={{backgroundColor: this.state.Layout_Background}}>
       <TextField id="outlined-basic" label="Title" variant="outlined"   error={this.state.layout_titleError !== ""}
          helperText={this.state.layout_titleError} onChange={this.onFieldChange} name="layout_title"/>
       </Box>
     <input 
            id={"contained-button-title"} 
            type="color" 
            hidden
            onChange={this.onFieldChange}
            name="Layout_Background"
            defaultValue="#ffffff"/>
           <label htmlFor={"contained-button-title"}>
            <Button color="primary" aria-label="upload picture" component="span">
          Layout Background
        </Button>
      </label>
      <h4>Select Services :  {this.state.selectedServices.length}</h4>
      <Box display="flex">
      <TextField 
     name="search"
     style={{flexGrow:1}}
     onChange={this.onFieldChange}
       label="Search" 
       variant="outlined"
        size="small" />

         <Button variant="contained" color="primary" onClick={this.searchService()}>
           Search
          </Button>
          </Box>
          <br/>
          {this.state.searching ? ( <Box display="flex" justifyContent="center"> <CircularProgress  /> </Box> ) : (
      <Box display="flex" flexWrap="true" bgcolor="#00000010">
        {this.state.servicelist === undefined ?
        this.loadLatestService():
        this.state.servicelist.map((item,index) => (
          <FormControlLabel
          control={<Checkbox onChange={e=>{
            if(e.target.checked)
            {
               this.state.selectedServices.push(item.id)
            }else{
            let posi =  this.state.selectedServices.indexOf(item.id)
            this.state.selectedServices.splice(posi,1)
            }
          }} />}
          label={<ServiceView item={item}/>}
          labelPlacement="bottom"
        />
         ))}
      </Box>
           ) }
           </div>
     }
      </Box>
      </Dialog>
              <Backdrop 
              style={{zIndex:1500}}
              open={this.state.loading} 
            >
            <CircularProgress color="primary" />
            </Backdrop>
            <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={this.state.snackbar !== ""}
        autoHideDuration={1000}
        onClose={
          e=>this.setState({
            snackbar:"",
          })
        }
        message={this.state.snackbar}
      />
            </div>
          );
    }
}

export const CategoryTab = ({icon,title}) =>{
    return ( 
    <Box textAlign="center">
        { icon !== "null"  ? (
        <img src={icon} style={{ height:"30px", width: "30px" }} /> ) : (<Home/>
        )}
        <Typography variant="body2">
            {title}
            </Typography>
    
    </Box>
    );
};

const mapStateToProps = (state) =>{
    return {
        categories: state.categories,
        categoryPages: state.categoryPages,
    }
}

const mapDispatchToProps = (dispatch) =>{
    return {
     loadCategories: (onSuccess,onError) => 
     dispatch(loadCategories(onSuccess,onError)),
     loadPage: 
     (category,onSuccess,onError) =>
      dispatch(loadCategoryPage(category,onSuccess,onError)),
     addsection:(page,list)=>dispatch({type : "LOAD_PAGE", payload: list, category:page})
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(HomeFragment);

