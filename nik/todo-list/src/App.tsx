import React, { useState } from 'react'
import './App.css'
import Grid from '@mui/material/Grid'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import AddBoxIcon from '@mui/icons-material/AddBox'
import FilterListIcon from '@mui/icons-material/FilterList'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CssBaseline from '@mui/material/CssBaseline'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import createTheme from '@mui/material/styles/createTheme'
import CheckIcon from '@mui/icons-material/Check'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DatePicker from '@mui/lab/DatePicker'
import TimePicker from '@mui/lab/TimePicker'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Button from '@mui/material/Button'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import Menu from '@mui/material/Menu'


const themeLight = createTheme({
  palette: {
    background: {
      default: "#F7F7F7"
    }
  }
})

const themeDark = createTheme({
  palette: {
    background: {
      default: "#222222"
    },
    text: {
      primary: "#ffffff"
    }
  }
})

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

interface iTask {
  id: number,
  taskName: string,
  taskType: string,
  taskDate: Date | null,
  taskTime: Date | null,
  taskDescription: string,
}

function App() {
  //Modal
  const [openModal, setOpenModal] = useState(false)
  const handleClose = () => setOpenModal(false)
  const [date, setDate] = useState<Date | null>(null)
  const [time, setTime] = useState(null)
  const [type, setType] = useState('');
  const handleChangeType = (event: SelectChangeEvent) => {
    setType(event.target.value as string);
  }
  const [name, setName] = useState('')
  const handleChangeName = (e: any) => {
    setName(e.target.value)
  }
  const [desc, setDesc] = useState('')
  const handleChangeDesc = (e: any) => {
    setDesc(e.target.value)
  }
  //List
  const [list, setList] = useState<iTask[]>([])
  const [completedList, setCompletedList] = useState<iTask[]>([])
  //Filters
  const [filter, setFilter] = useState('')
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const openFilterMenu = Boolean(anchorEl)
  const handleClickFilterMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }
  const handleFilter = (filter: string) => {
    setFilter(filter)
    setAnchorEl(null)
  }
  //Misc
  const [light, setLight] = useState(true)
  const [search, setSearch] = useState('')


  const handleAddNewTask = () => {
    setList([...list, {
      taskName: name,
      taskType: type,
      taskDate: date,
      taskTime: time,
      taskDescription: desc,
      id: Math.random(),
    }])
    setDate(null)
    setType('')
    setName('')
    setDesc('')
    setTime(null)
    handleClose()
  }
  const handleCompleteTask = (index: number, id: number) => {
    setCompletedList([...completedList, list[index]])
    setList(list.filter(item => item.id !== id))
  }
  const handleMoveToActive = (index: number, id: number) => {
    setList([...list, completedList[index]])
    setCompletedList(list.filter(item => item.id !== id))
  }
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={light ? themeLight : themeDark}>
        <CssBaseline/>
        <Modal
          open={openModal}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant='h5' sx={{mb: 3}}>Enter new task</Typography>
              <TextField id='name' label='Enter a task title' fullWidth  value={name} onChange={handleChangeName} sx={{mb: 2}}/>
              <FormControl fullWidth sx={{mb: 2}}>
                <InputLabel id="type-label">Select a task type</InputLabel>
                <Select
                  labelId="type-select"
                  id="type-select"
                  value={type}
                  label="Type"
                  onChange={handleChangeType}
                >
                  <MenuItem value='Work'>Work</MenuItem>
                  <MenuItem value='University'>University</MenuItem>
                  <MenuItem value='Other'>Other</MenuItem>
                </Select>
              </FormControl>
              <DatePicker
                label="Pick a date"
                value={date}
                onChange={(newValue) => {
                  setDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} fullWidth  sx={{mb: 2}}/>}
              />
              <TimePicker
                label="Pick a time"
                value={time}
                onChange={(newValue) => {
                  setTime(newValue);
                }}
                renderInput={(params) => <TextField {...params} fullWidth  sx={{mb: 2}}/>}
              />
              <TextField id='task-description' label='Enter a task description' fullWidth multiline value={desc} onChange={handleChangeDesc} sx={{mb: 2}}/>
              <Button variant='outlined' onClick={() => handleAddNewTask()}>Done</Button>
            </Grid>
          </Box>
        </Modal>
        <Grid className="main" sx={{padding: 2}}>
          <Stack direction="row" spacing={2}>
            <TextField label="Search task" value={search} onChange={(event) => setSearch(event.target.value)} sx={{width: '95%'}}/>
            <IconButton 
              color="primary" aria-label="filter-list" sx={{borderRadius: '20%', width: 50}}
              id="basic-button"
              aria-controls={openFilterMenu ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openFilterMenu ? 'true' : undefined}
              onClick={handleClickFilterMenu}
            >
              <FilterListIcon/>
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={openFilterMenu}
              onClose={() => setAnchorEl(null)}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={() => handleFilter('Work')}>Work</MenuItem>
              <MenuItem onClick={() => handleFilter('University')}>University</MenuItem>
              <MenuItem onClick={() => handleFilter('Other')}>Other</MenuItem>
            </Menu>
            <IconButton color="primary" aria-label="add-task" sx={{borderRadius: '20%', width: 50}} onClick={() => setOpenModal(true)}>
              <AddBoxIcon/>
            </IconButton>
          </Stack>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{paddingTop: 2, paddingBottom: 1}}
          >
            <Typography variant="h5">ACTIVE</Typography>
          </Grid>
          <Grid
          >
            {list.filter((task) => {
              if(search === ''){
                return task
              } else if (task.taskName.toLowerCase().includes(search.toLowerCase())) {
                return task
              }
            }).map((task, index) => {
              return (
                <Card sx={{ maxWidth: '100%', marginBottom: 2 }} key={`task-${index}`}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: 'purple' }} aria-label="recipe">
                        N
                      </Avatar>
                    }
                    action={
                      <>
                        <IconButton onClick={()=>handleCompleteTask(index, task.id)}>
                          <CheckIcon/>
                        </IconButton>
                        <IconButton onClick={()=> setList(list.filter(item => item.id !== task.id))}>
                          <RemoveCircleOutlineIcon/>
                        </IconButton>
                      </>
                    }
                    title={task.taskName}
                    subheader={`${task.taskDate?.getDay()}/${(task.taskDate?.getMonth() || 0) +1}/${task.taskDate?.getFullYear()} ${task.taskTime?.getHours()}:${task.taskTime?.getMinutes()}hs | ${task.taskType}`}
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {task.taskDescription}
                    </Typography>
                  </CardContent>
                </Card>
              )
            })}
          </Grid>
          <Divider/>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{paddingTop: 2, paddingBottom: 1}}
          >
            <Typography variant="h5">COMPLETED</Typography>
          </Grid>
          <Grid>
            {completedList.map((task, index) => {
              return (
                <Card sx={{ maxWidth: '100%', marginBottom: 2 }} key={`task-${index}`}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: 'purple' }} aria-label="recipe">
                        N
                      </Avatar>
                    }
                    action={
                      <>
                        {/* <IconButton onClick={()=>handleMoveToActive(index, task.id)}>
                          <CheckIcon/>
                        </IconButton> */}
                        <IconButton onClick={()=> setCompletedList(completedList.filter(item => item.id !== task.id))}>
                          <RemoveCircleOutlineIcon/>
                        </IconButton>
                      </>
                    }
                    title={task.taskName}
                    subheader={`${task.taskDate?.getDay()}/${(task.taskDate?.getMonth() || 0) +1}/${task.taskDate?.getFullYear()} ${task.taskTime?.getHours()}:${task.taskTime?.getMinutes()}hs | ${task.taskType}`}
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {task.taskDescription}
                    </Typography>
                  </CardContent>
                </Card>
              )
            })}
          </Grid>
        </Grid>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
