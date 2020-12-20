import { Box, Typography } from '@material-ui/core'
import React from 'react'
import ServiceView from './ServiceView'
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';

const HorizontalScroller = props => {
    

        const [anchorEl, setAnchorEl] = React.useState(null);
      const open = Boolean(anchorEl);
     
      const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
    
      const handleClose = () => {
        setAnchorEl(null);
      }; 
    
      
    return (
    <>
    <div style={{position:"absolute",right:0}}>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: '20ch',
          },
        }}
      >
       
       
          <MenuItem  onClick={()=>{
            props.delete();
            handleClose();
            }}
            >
           Delete
          </MenuItem>
        
      </Menu>
    </div>
        <Box style={{background:props.background}} p="16px">
            
        <Typography variant="h5">{props.title}</Typography>
        <Box display="flex" overflow="auto">
            {props.services.map((item,index)=>
            <ServiceView item ={item}/>)}
       
    </Box>
    </Box>
    </>
    )

            }
export default HorizontalScroller;
