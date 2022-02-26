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

const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  {
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    year: 2001,
  },
  {
    title: 'Star Wars: Episode V - The Empire Strikes Back',
    year: 1980,
  },
  { title: 'Forrest Gump', year: 1994 },
  { title: 'Inception', year: 2010 },
  {
    title: 'The Lord of the Rings: The Two Towers',
    year: 2002,
  },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: 'Goodfellas', year: 1990 },
  { title: 'The Matrix', year: 1999 },
  { title: 'Seven Samurai', year: 1954 },
  {
    title: 'Star Wars: Episode IV - A New Hope',
    year: 1977,
  },
  { title: 'City of God', year: 2002 },
  { title: 'Se7en', year: 1995 },
  { title: 'The Silence of the Lambs', year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: 'Life Is Beautiful', year: 1997 },
  { title: 'The Usual Suspects', year: 1995 },
  { title: 'Léon: The Professional', year: 1994 },
  { title: 'Spirited Away', year: 2001 },
  { title: 'Saving Private Ryan', year: 1998 },
  { title: 'Once Upon a Time in the West', year: 1968 },
  { title: 'American History X', year: 1998 },
  { title: 'Interstellar', year: 2014 },
  { title: 'Casablanca', year: 1942 },
  { title: 'City Lights', year: 1931 },
  { title: 'Psycho', year: 1960 },
  { title: 'The Green Mile', year: 1999 },
  { title: 'The Intouchables', year: 2011 },
  { title: 'Modern Times', year: 1936 },
  { title: 'Raiders of the Lost Ark', year: 1981 },
  { title: 'Rear Window', year: 1954 },
  { title: 'The Pianist', year: 2002 },
  { title: 'The Departed', year: 2006 },
  { title: 'Terminator 2: Judgment Day', year: 1991 },
  { title: 'Back to the Future', year: 1985 },
  { title: 'Whiplash', year: 2014 },
  { title: 'Gladiator', year: 2000 },
  { title: 'Memento', year: 2000 },
  { title: 'The Prestige', year: 2006 },
  { title: 'The Lion King', year: 1994 },
  { title: 'Apocalypse Now', year: 1979 },
  { title: 'Alien', year: 1979 },
  { title: 'Sunset Boulevard', year: 1950 },
  {
    title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
    year: 1964,
  },
  { title: 'The Great Dictator', year: 1940 },
  { title: 'Cinema Paradiso', year: 1988 },
  { title: 'The Lives of Others', year: 2006 },
  { title: 'Grave of the Fireflies', year: 1988 },
  { title: 'Paths of Glory', year: 1957 },
  { title: 'Django Unchained', year: 2012 },
  { title: 'The Shining', year: 1980 },
  { title: 'WALL·E', year: 2008 },
  { title: 'American Beauty', year: 1999 },
  { title: 'The Dark Knight Rises', year: 2012 },
  { title: 'Princess Mononoke', year: 1997 },
  { title: 'Aliens', year: 1986 },
  { title: 'Oldboy', year: 2003 },
  { title: 'Once Upon a Time in America', year: 1984 },
  { title: 'Witness for the Prosecution', year: 1957 },
  { title: 'Das Boot', year: 1981 },
  { title: 'Citizen Kane', year: 1941 },
  { title: 'North by Northwest', year: 1959 },
  { title: 'Vertigo', year: 1958 },
  {
    title: 'Star Wars: Episode VI - Return of the Jedi',
    year: 1983,
  },
  { title: 'Reservoir Dogs', year: 1992 },
  { title: 'Braveheart', year: 1995 },
  { title: 'M', year: 1931 },
  { title: 'Requiem for a Dream', year: 2000 },
  { title: 'Amélie', year: 2001 },
  { title: 'A Clockwork Orange', year: 1971 },
  { title: 'Like Stars on Earth', year: 2007 },
  { title: 'Taxi Driver', year: 1976 },
  { title: 'Lawrence of Arabia', year: 1962 },
  { title: 'Double Indemnity', year: 1944 },
  {
    title: 'Eternal Sunshine of the Spotless Mind',
    year: 2004,
  },
  { title: 'Amadeus', year: 1984 },
  { title: 'To Kill a Mockingbird', year: 1962 },
  { title: 'Toy Story 3', year: 2010 },
  { title: 'Logan', year: 2017 },
  { title: 'Full Metal Jacket', year: 1987 },
  { title: 'Dangal', year: 2016 },
  { title: 'The Sting', year: 1973 },
  { title: '2001: A Space Odyssey', year: 1968 },
  { title: "Singin' in the Rain", year: 1952 },
  { title: 'Toy Story', year: 1995 },
  { title: 'Bicycle Thieves', year: 1948 },
  { title: 'The Kid', year: 1921 },
  { title: 'Inglourious Basterds', year: 2009 },
  { title: 'Snatch', year: 2000 },
  { title: '3 Idiots', year: 2009 },
  { title: 'Monty Python and the Holy Grail', year: 1975 },
]

const shortMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

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
  const [selected, setSelected] = useState(false);
  //Misc
  const [light, setLight] = useState(true)


  const handleAddNewTask = () => {
    setList([...list, {
      taskName: name,
      taskType: type,
      taskDate: date,
      taskTime: time,
      taskDescription: desc,
    }])
    setDate(null)
    setType('')
    setName('')
    setDesc('')
    setTime(null)
    handleClose()
  }

  const handleCompleteTask = (index: number) => {
    setCompletedList([...completedList, list[index]])
    setList(list.splice(index))
    console.info(`${index} remove`)
  }

  const handleRemoveItem = (e: any) => {
    const name = e.target.getAttribute("name")
     setList(list.filter(item => item.taskName !== name));
   };
  
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
                  <MenuItem value={'Work'}>Work</MenuItem>
                  <MenuItem value={'University'}>University</MenuItem>
                  <MenuItem value={'Other'}>Other</MenuItem>
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
            <Autocomplete
              id="search-bar"
              freeSolo
              options={top100Films.map((option) => option.title)}
              renderInput={(params) => <TextField {...params} label="Search task"/>}
              sx={{width: '95%'}}
            />
            <IconButton color="primary" aria-label="filter-list" sx={{borderRadius: '20%', width: 50}}>
              <FilterListIcon/>
            </IconButton>
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
            {list.map((task, index) => {
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
                      <IconButton onClick={()=>handleCompleteTask(index)}>
                        <CheckIcon/>
                      </IconButton>
                      <IconButton>
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
                      <IconButton>
                        <RemoveCircleOutlineIcon/>
                      </IconButton>
                    }
                    title={task.taskName}
                    subheader={`${task.taskDate?.getDay}.${task.taskDate?.getMonth}.${task.taskDate?.getFullYear} ${task.taskTime?.getTime} | ${task.taskType}`}
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
