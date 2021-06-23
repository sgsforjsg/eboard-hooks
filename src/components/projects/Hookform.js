import React, { useEffect, useState } from 'react'
import firebase from "firebase";
import { useForm } from "react-hook-form";
//import { connect } from 'react-redux'
import { connect } from "react-redux";
import { useDispatch } from 'react-redux'
import FileUploader from "react-firebase-file-uploader";
import imageCompression from 'browser-image-compression';
import { createProject } from '../../store/actions/noticeActions'
import { Redirect } from 'react-router-dom'
import M from "materialize-css";

const CreateNotice1 = ({ project, id, auth }) => {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: {
FirstName:id !== 'a' ? project.FirstName : '', 
Address1:id !== 'a' ? project.Address1 : '', 
Address0:id !== 'a' ? project.Address0 : '', 
Address2:id !== 'a' ? project.Address2 : '', 
Mobile:id !== 'a' ? project.Mobile : '', 
furl:id !== 'a' ? project.furl : '', 
course:id !== 'a' ? project.course : '', 
payment:id !== 'a' ? project.payment : '', 
uploadProgress: 0,
id1: id
    }
  })
  const watchCourse = watch("course", false);
  const watchAddress = watch("Address", false);
  const dispatch = useDispatch();

  const onSubmit = data => {
    console.log(data)
    alert('p')
     dispatch(createProject(data))
  }
  console.log(errors);

  useEffect(() => {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems, {});
    var elems1 = document.querySelectorAll('.materialboxed');
    var instances = M.Materialbox.init(elems1, {});

  }, []);

  // upload--------
  const handleUploadStart = () => {
    console.log('started')

  }

  const handleUploadError = error => {

    console.error(error);
  };
  const handleUploadSuccess = async filename => {
    console.log(filename)
    const downloadURL = await firebase
      .storage()
      .ref("images")
      .child(filename)
      .getDownloadURL().then((url) => {
        setValue("furl", url)
        console.log(url, 'url')
      });
    console.log(filename)
  };
  const handleProgress = progress => {
    setValue('uploadProgress', progress)
    console.log(progress)
      ;
  }
  const deletefile = (e) => {
    e.preventDefault();
    var fileRef = firebase.storage().refFromURL(project.furl);
    fileRef.delete().then(function () {

      // File deleted successfully 
      console.log("File Deleted")
    }).catch(function (error) {
      // Some Error occurred 
    });
    console.log('delete file sucessfully')
  }

  //upload over
  //resize and then upload
  function handleImageUpload(event) {
    console.log('handleImageUpload(event)', event.target.files[0])
    var imageFile = event.target.files[0];
    console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
    console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

    var options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }
    imageCompression(imageFile, options)
      .then(function (compressedFile) {
        console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
        console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
        //const file = input.files[0];
        const url = URL.createObjectURL(compressedFile);
        console.log(url)
        return compressedFile; // write your own logic

      }).then((url) => {
        console.log('message', url);
        let file = url;
        let storageRef = firebase.storage().ref(`${'image'}/${file.name}`);
        let uploadTask = storageRef.put(file);
        // ----------------------------
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          // eslint-disable-next-line default-case
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log('Upload is running');
              break;


          }
        }, (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          // eslint-disable-next-line default-case
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;
            case 'storage/canceled':
              // User canceled the upload
              break;

            // ...

            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        }, () => {
          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            setValue("furl", downloadURL)

            console.log('File available at', downloadURL);
          });
        }
        );



        //----------------------

      })
      .catch(function (error) {
        console.log(error.message);
      });
  }

  const aa = () => {
    console.log('fsdfsdfs')
  }
  return (
    <div className='container'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder="Surname First name Last Name" {...register("FirstName", { required: true, maxLength: 80 })} />
        <input type="text" placeholder="Present Address" {...register("Address1", { required: true, maxLength: 300 })} />
        <h6>Permanent address is same as above ?</h6>
        <select {...register("Address0", { required: true })} >

          <option value="1">Yes</option>
          <option value="2">No</option>
        </select>
        {watchAddress === '2' && <input type="text" placeholder="Address2"  {...register("address2", { maxLength: 300 })} />}


        <input type="tel" placeholder="Mobile number" {...register("Mobile", { required: true, minLength: 6, maxLength: 12 })} />
        
        <h5>Passport style Photo</h5>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <input type="text" placeholder="Image Url" {...register("furl", { required: true })} />
        {id !== 'a' ? <img className="materialboxed" width="50" src={project.furl} /> : '-'}
       
        <div>
          <h6>Select Course</h6>


        </div>
        <select {...register("course", { required: true })}>
          <option value="DIS">DIS (Pay Rs. 300)</option>
          <option value="DET">DET(Pay Rs. 300) </option>
          <option value="DIS/DET">BOTH(Pay Rs. 600) </option>
        </select>
        {watchCourse === "DIS/DET" && <h6>Maximum one admission as per merit</h6>} 
        {watchCourse  && <input type="text" placeholder="Payent ID,Date" {...register("payment", { required: true, maxLength: 300 })} />
} 
        <div className="container uploading">
          <h5>Passport style Photo</h5>
          <FileUploader
            accept="image/*"
            name="avatar"
            randomizeFilename
            handleImageUpload
            storageRef={firebase.storage().ref("images")}
            onUploadStart={handleUploadStart}
            onUploadError={handleUploadError}
            onUploadSuccess={handleUploadSuccess}
            onProgress={handleProgress}
          />
        </div>

        <input type="submit" />
      </form>
    </div>)

}
//const Hookform = connect()(CreateNotice);
//export default Hookform;
const mapStateToProps = (state, ownProps) => {
  //console.log(ownProps.match.params.id)
  let id = null
  if (ownProps.match.params.id) { id = ownProps.match.params.id }
  const projects = state.firestore.data.notice;
  const project = projects ? projects[id] : '--'
  console.log(project, id)
  return {
    project: project,
    auth: state.firebase.auth,
    id: id
  }
}

export default connect(mapStateToProps)(CreateNotice1)
