import { Component, OnInit, Input } from '@angular/core';
import { UploadService } from '../upload.service';
import { Upload } from 'src/app/models/upload';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.css']
})
export class UploadFormComponent implements OnInit {

  @Input() id;
  selectedFiles: FileList;
  currentFileUploaded: Upload;
  progress: { percentage: number } = { percentage: 0 };

  constructor(
    public uploadService: UploadService
  ) { }

  ngOnInit() {
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  upload(){
    const file = this.selectedFiles.item(0);
    this.currentFileUploaded = new Upload(file);
    this.uploadService.pushFileToStorage(this.currentFileUploaded, this.progress, this.id);
  }

}
