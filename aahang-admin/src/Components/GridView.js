import { Box, Typography } from '@material-ui/core'
import React from 'react'
import ServiceView from './ServiceView'
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';

const GridView = (props) => {
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
          <Box>
            <Typography variant="h5">{props.title}</Typography>
            <Box display="flex" justifyContent="center">
            <ServiceView item={props.services[0]}/>
          <ServiceView item={props.services[1]}/>
            </Box>
            <Box display="flex" justifyContent="center">
            <ServiceView item={props.services[2]}/>
          <ServiceView item={props.services[3]}/>
            </Box>
        </Box>
        </>
        
    )
}

export default GridView
