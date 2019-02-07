import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFirestore } from 'angularfire2/firestore';
import * as faker from 'faker';
import { Upload } from '../models/upload';
import { SnackService } from '../common/snack.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private basePath = '/products';
  
  constructor(
    private afs: AngularFirestore,
    private snackService: SnackService
  ) { }

  pushFileToStorage(fileUpload: Upload, progress: {percentage: number}, id: any){
    const storageRef = firebase.storage().ref();
    const fileId = faker.random.alphaNumeric(16);
    const uploadTask = storageRef.child(`${this.basePath}/${fileId}`).put(fileUpload.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
      const snap = snapshot as firebase.storage.UploadTaskSnapshot;
      progress.percentage = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
    },
    (error) => {
      this.snackService.launch("Error: " + error.message, "Tienda", 3000);
    },
    () => {
      fileUpload.id = fileId;
      fileUpload.name = fileUpload.file.name;
      uploadTask.snapshot.ref.getDownloadURL().then( downloadUrl => {
        fileUpload.url = downloadUrl;
        this.saveFileData(fileUpload, id);
      });     
    })
  }

  private saveFileData(fileUpload: Upload, id){
    let product = this.afs.collection('products').doc(id);
    let newRef = product.collection('uploads').doc(fileUpload.id);
    newRef.set({
      id: fileUpload.id,
      name: fileUpload.name,
      url: fileUpload.url
    });
  }

  public removeFile(fileId){
    return firebase.storage().ref().child(`${this.basePath}/${fileId}`).delete();
  }
}
