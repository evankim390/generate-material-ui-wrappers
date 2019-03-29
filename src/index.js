const changeCase = require('change-case');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

// MuiThemeProvider not here as it's not a typical component.
const components = ["AppBar","Avatar","Backdrop","Badge","BottomNavigation","BottomNavigationAction","Button","ButtonBase","Card","CardActionArea","CardActions","CardContent","CardHeader","CardMedia","Checkbox","Chip","CircularProgress","ClickAwayListener","Collapse","CssBaseline","Dialog","DialogActions","DialogContent","DialogContentText","DialogTitle","Divider","Drawer","ExpansionPanel","ExpansionPanelActions","ExpansionPanelDetails","ExpansionPanelSummary","Fab","Fade","FilledInput","FormControl","FormControlLabel","FormGroup","FormHelperText","FormLabel","Grid","GridList","GridListTile","GridListTileBar","Grow","Hidden","Icon","IconButton","Input","InputAdornment","InputBase","InputLabel","LinearProgress","Link","List","ListItem","ListItemAvatar","ListItemIcon","ListItemSecondaryAction","ListItemText","ListSubheader","Menu","MenuItem","MenuList","MobileStepper","Modal","NativeSelect","NoSsr","OutlinedInput","Paper","Popover","Popper","Portal","Radio","RadioGroup","RootRef","Select","Slide","Snackbar","SnackbarContent","Step","StepButton","StepConnector","StepContent","StepIcon","StepLabel","Stepper","SvgIcon","SwipeableDrawer","Switch","Tab","Table","TableBody","TableCell","TableFooter","TableHead","TablePagination","TableRow","TableSortLabel","Tabs","TextField","Toolbar","Tooltip","TouchRipple","Typography","Zoom"];

// Used for components which aren't at the default @material-ui/core/ComponentName location.
const customDependencyMap = {
  TouchRipple: 'ButtonBase/TouchRipple',
};

const templates = {
  index: getTemplate('index'),
  stories: getTemplate('stories'),
  component: getTemplate('component'),
};

function getTemplate(name) {
  const absolutePath = path.resolve(__dirname, `./templates/${name}.ejs`);
  const file = fs.readFileSync(absolutePath);
  return ejs.compile(file.toString());
}

function writeFile(folderName, fileName, content) {
  const directory = path.resolve(__dirname, `../dist/${folderName}`);
  fs.mkdirSync(directory, { recursive: true });

  const filepath = path.resolve(directory, `${fileName}`);
  fs.writeFileSync(filepath, content);
}

(function generateFiles() {
  for (const component of components) {
    const generatedIndexFile = templates.index({
      component,
    });
    writeFile(component, 'index.ts', generatedIndexFile);
    
    const generatedComponentFile = templates.component({
      component,
      componentDashed: changeCase.paramCase(component),
      dependencyLocation: customDependencyMap[component] ?
          `@material-ui/core/${customDependencyMap[component]}` :
          `@material-ui/core/${component}`,
    });
    writeFile(component, `${component}.tsx`, generatedComponentFile);

    const generatedStoriesFile = templates.stories({
      component,
    });
    writeFile(component, `${component}.stories.tsx`, generatedStoriesFile);
  }
}());