
/**
 * Create migration file
 */
const create = () => {
    console.log("Create migration") 
    //make a file in migrations folder
    //naming convention of file - migration_<date>_00001.js
    //content in file should be picked up from template folder respective file like createTable.txt
    // value to be put in placeholders
    //save as .js in migrations folder
};

module.exports= {
  create
};

require('make-runnable');