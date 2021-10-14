<!--  -->
<template>
  <el-dialog
    class="img-edit-dialog"
    :append-to-body="false"
    :title="title"
    :visible.sync="display"
    width="1000px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="close">
    <div class="editor-area" v-loading="loading">
      <!-- <img ref="imageEditor" crossOrigin="Anonymous" :src="newSrc" alt=""> -->
      <!-- <img crossOrigin = "anonymous" scr style="width:100px;height:100px" src="" alt="" ref="imgDom"> -->
      <div  class="img-container">
        <div class="image-editor cropper-editor" v-show="subMenu=='rotation'||subMenu=='crop'"> 
          <img ref="imageEditor" crossOrigin = "anonymous" :src="loadingSrc" alt="" style="max-width: 100%;display:none">
        </div>
        <div v-show="subMenu=='drawLine'||subMenu=='text'"  class="image-editor fabric-editor" v-loading="fabricLoading"> 
          <canvas id="fabricEditor" width="500" height="300" style="max-width: 100%;"></canvas>
        </div>
      </div> 
      <div class="image-controls">
        <div class="menu">
          <div class="crop_items flex" v-if="subMenu=='crop'">
            <div class="items">
              <span @click="_crop_cancel" style="margin-right:50px;color:#ABB7C4;vertical-align:middle">
                <i class="iconfont icon-close" style="font-size:26px;cursor:pointer"></i>
              </span>
              <!-- <span class="item" :class="{active:menu.crop.name=='自由'}" @click="cropSelect(menu.crop.options.filter(el=>{return el.name=='自由'})[0])">自由</span> -->
              <span class="item crop_item" :class="{active:menu.crop.name=='自由'}" @click="cropSelect(menu.crop.options[0])" style="width:40px;padding-top:16px">自由</span>
              <span class="item crop_item" :class="{active:menu.crop.name=='1:1'}" @click="cropSelect(menu.crop.options[1])" style="width:40px;padding-top:18px">1:1</span>
              <span class="item crop_item" :class="{active:menu.crop.name=='3:2'}" @click="cropSelect(menu.crop.options[2])" style="width:40px;padding-top:9px">3:2</span>
              <span class="item crop_item" :class="{active:menu.crop.name=='4:3'}" @click="cropSelect(menu.crop.options[3])" style="width:38px;padding-top:7px">4:3</span>
              <span class="item crop_item" :class="{active:menu.crop.name=='5:4'}" @click="cropSelect(menu.crop.options[4])" style="width:37px;padding-top:6px">5:4</span>
              <span class="item crop_item" :class="{active:menu.crop.name=='7:5'}" @click="cropSelect(menu.crop.options[5])" style="width:37px;padding-top:5px">7:5</span>
              <span class="item crop_item" :class="{active:menu.crop.name=='16:9'}" @click="cropSelect(menu.crop.options[6])" style="width:40px;padding-top:5px">16:9</span>
              <!-- <span class="item crop_item" :class="{active:menu.crop.name==item.name}" @click="cropSelect(item)" v-for="(item,index) of menu.crop.options" :key="index">{{item.name}}</span> -->
              <span @click="_crop_apply" style="margin-left:50px;color:#ABB7C4;vertical-align:middle">
                <i class="iconfont icon-check" style="font-size:30px;cursor:pointer"></i>
              </span>
            </div>
          </div> 
          <div class="crop_items flex" v-if="subMenu=='rotation'">
            <div class="items" style="margin:0 auto;display:inline-block">
              <span @click="rotate(-45)" style="vertical-align:middle;margin-right:30px;display:inline-block;">
                <i class="iconfont icon-turn-left1" style="cursor:pointer;font-size:44px;color:#ABB7C4"></i>
              </span>
              <span  @click="rotate(45)" style="vertical-align:middle;margin-right:30px;display:inline-block;">
                <i class="iconfont icon-turn-right1" style="cursor:pointer;font-size:44px;color:#ABB7C4"></i>
              </span>
              <span  @click="flip('x')" style="vertical-align:middle;margin-right:30px;display:inline-block;">
                <i class="iconfont icon-mirror-left" style="cursor:pointer;font-size:44px;color:#ABB7C4"></i>
              </span>
              <span  @click="flip('y')" style="vertical-align:middle;margin-right:0px;display:inline-block;">
                <i class="iconfont icon-mirror-bottom" style="cursor:pointer;font-size:44px;color:#ABB7C4"></i>
              </span>
              <!-- <span>
                <span style="color:#ABB7C4;width:48px;padding:4px 0;display:inline-block;vertical-align:middle" >自由</span>
                <el-slider size="medium" style="width:100px;display:inline-block;vertical-align:middle;margin-right:10px" :step="1" :max="180" :min="-180" v-model="rotation"></el-slider>
                <span style="width:48px;padding:4px 0;background:rgba(255,255,255,1);border-radius:2px;border:2px solid rgba(171,183,196,1);display:inline-block;vertical-align:middle;color:#ABB7C4" >{{rotation}}</span>
              </span> -->
            </div>
          </div> 
          <div class="crop_items" v-if="subMenu=='drawLine'">
            <div class="flex" style="justify-content: center;">
              <dl style="display:inline-block;margin-right:30px;cursor:pointer;" :class="{active:menu.drawLine.mode==1}" @click="_drawFree()">
                <dt>
                  <i class="iconfont icon-fsux_tubiao_fenbuquxiantu"  style="font-size:40px"></i>
                </dt>
                <dd>
                  曲线
                </dd>
              </dl>
              <dl  style="display:inline-block;cursor:pointer;" :class="{active:menu.drawLine.mode==2}" @click="menu.drawLine.mode=2;_drawLine()">
                <dt>
                  <i class="iconfont icon-xian"  style="font-size:40px" ></i>
                </dt>
                <dd>
                  直线
                </dd>
              </dl>
              <div style="height:50px;width:1px;background:#DCDDEB;margin:0 30px"></div>
              <span>
                <span style="display:inline-block;vertical-align:middle;">粗细</span>
                <el-slider style="width:100px;display:inline-block;vertical-align:middle;margin:0 10px" :step="1" :max="30" :min="1" v-model="menu.drawLine.size" @change="()=>{_drawStyle()}"></el-slider>
              </span>
              <div style="height:50px;width:1px;background:#DCDDEB;margin:0 30px"></div>
              <span>
                <span style="display:inline-block;vertical-align:middle;margin-right:12px">颜色</span>
                <el-color-picker style="vertical-align:middle;" v-model="menu.drawLine.color" @change="_drawStyle"></el-color-picker>
              </span>
            </div>
          </div> 
          <div class="crop_items flex" v-if="subMenu=='text'">
            <div  class="flex" style="justify-content: center;">
              <dl style="display:inline-block;margin-right:30px;cursor:pointer;" :class="{active:menu.text.bold}" @click="menu.text.bold=!menu.text.bold;_changeTextStyle('b')">
                <dt>
                  <i class="iconfont icon-bold"  style="font-size:34px"></i>
                </dt>
                <dd>
                  加粗
                </dd>
              </dl>
              <dl style="display:inline-block;margin-right:30px;cursor:pointer;" :class="{active:menu.text.italic}" @click="menu.text.italic=!menu.text.italic;_changeTextStyle('i')">
                <dt>
                  <i class="iconfont icon-T-qingxie"  style="font-size:34px"></i>
                </dt>
                <dd>
                  倾斜
                </dd>
              </dl>
              <dl style="display:inline-block;margin-right:30px;cursor:pointer;" :class="{active:menu.text.underline}" @click="menu.text.underline=!menu.text.underline;_changeTextStyle('u')">
                <dt>
                  <i class="iconfont icon-705bianjiqi_Uxiahuaxian"  style="font-size:34px"></i>
                </dt>
                <dd>
                  下划线
                </dd>
              </dl>
              <div style="height:50px;width:1px;background:#DCDDEB;margin:0 30px"></div>
              <dl style="display:inline-block;margin-right:30px;cursor:pointer;" :class="{active:menu.text.align=='left'}" @click="menu.text.align='left';_changeTextStyle('l')">
                <dt>
                  <i class="iconfont icon-zuoduiqi"  style="font-size:34px"></i>
                </dt>
                <dd>
                  左对齐
                </dd>
              </dl>
              <dl style="display:inline-block;margin-right:30px;cursor:pointer;" :class="{active:menu.text.align=='center'}" @click="menu.text.align='center';_changeTextStyle('c')">
                <dt>
                  <i class="iconfont icon-733bianjiqi_juzhongduiqi"  style="font-size:34px"></i>
                </dt>
                <dd>
                  居中对齐
                </dd>
              </dl>
              <dl style="display:inline-block;margin-right:30px;cursor:pointer;" :class="{active:menu.text.align=='right'}" @click="menu.text.align='right';_changeTextStyle('r')">
                <dt>
                  <i class="iconfont icon-youduiqi"  style="font-size:34px"></i>
                </dt>
                <dd>
                  右对齐
                </dd>
              </dl>
              <div style="height:50px;width:1px;background:#DCDDEB;margin:0 30px"></div>
              <span>
                <span style="display:inline-block;vertical-align:middle;">颜色</span>
                <el-color-picker style="vertical-align:middle" v-model="menu.text.color" @change="(value)=>{_changeTextStyle('f')}"></el-color-picker>
              </span>
              <div style="height:50px;width:1px;background:#DCDDEB;margin:0 30px"></div>
              <span>
                <span style="display:inline-block;vertical-align:middle;">大小</span>
                <el-slider style="width:100px;display:inline-block;vertical-align:middle;margin:0 10px" :step="1" :max="100" :min="12" v-model="menu.text.size" @change="(value)=>{_changeTextStyle('s')}"></el-slider>
              </span>
            </div>
          </div> 
        </div>
        <div class="submenu flex">
          <i class="iconfont icon-caiqie" :class="{active:subMenu=='crop'}" @click="showMenu('crop')"></i>
          <i class="iconfont icon-xuanzhuan" :class="{active:subMenu=='rotation'}" @click="showMenu('rotation')"></i>
          <i class="iconfont icon-shiwu-huabi" :class="{active:subMenu=='drawLine'}"  @click="showMenu('drawLine')"></i>
          <i class="iconfont icon-wenzi" :class="{active:subMenu=='text'}" @click="showMenu('text')"></i>
          <!-- <el-button type="primary" >裁切</el-button>
          <el-button type="primary" @click="showMenu('rotation')">旋转</el-button>
          <el-button type="primary">画笔</el-button>  
          <el-button type="primary" >文字</el-button>  -->
        </div>
      </div>
    </div>
    <span slot="footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary"  @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
// const ImageEditor = require('tui-image-editor');
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.min.css'
import OSS from "ali-oss"
import axios from "axios";
import SparkMD5 from "spark-md5"
import num from '@/components/number'
import {fabric} from 'fabric';
import { mapGetters, mapMutations, mapState } from "vuex";
export default {
  props:{
    title:{
      type:String,
      default:'图片编辑'
    },
    show:{
      type:Boolean,
      default:false
    },
    src:{
      type:String,
      default:"",
    }
  },
  data () {
    return {
      fabricLoading:false,
      popoverShow:false,
      display:false,
      ali_oss_config:{},
      loading:false, 
      newSrc:"",
      loadingSrc:'',
      subMenu:'crop',
      menu:{
        crop:{
          name:'1:1',
          options:[
            {
              name:'自由',
              value:NaN,
            },
            {
              name:'1:1',
              value:1
            },
            {
              name:'3:2',
              value:3/2
            },
            {
              name:'4:5',
              value:4/5
            },
            {
              name:'5:4',
              value:5/4
            },
            {
              name:'7:5',
              value:7/5
            },
            {
              name:'16:9',
              value:16/9
            }
          ],
          cropWidth:undefined,
          cropHeight:undefined,
          value:1
        },
        rotation:{
          flipY:1,
          flipX:1,
        },
        drawLine:{
          name:'drawLine',
          mode:1,
          modeType:[
            {
              name:'Free drawing',
              value:1
            },
            {
              name:'Straight line',
              value:2
            }
          ],
          color:'#000000',
          size:2
        },
        text:{
          name:'text',
          color:'#000000',
          size:30,
          align:'left',
          alignType:['left','center','right'],
          bold:false,
          italic:false,
          underline:false,
        }
      },
      options:{
        aspectRatio: 1/1,
        viewMode:2,
        movable:false,
        zoomOnWheel:false,
        toggleDragModeOnDblclick:false,
        minCropBoxWidth:10,
        minCropBoxHeight:10,
      },
      mouseFrom:{},
      mouseTo:{},
      moveCount:1,
      doDrawing: false,
      drawingObject : null,
      clickObj:false,
      scaling:1,
      cropper:null,
      fabricCanvas:null,
      canvas:{
        width:500,
        height:300
      }
    };
  },
  watch:{
    src(newVal){
      this.loadingSrc=""
      this.loadingSrc=this.src+'?t=' + new Date().getTime()
    },
    show(val){
      this.display=val
      if(val){
        this.loadingSrc=""
        this.loadingSrc=this.src+'?t=' + new Date().getTime()
        this.$nextTick(()=>{
          this.initCropperEditor()
        })
      }else{
        this.destroy()
        this.subMenu='crop',
        this.menu={
          crop:{
            name:'1:1',
            options:[
              {
                name:'自由',
                value:NaN,
              },
              {
                name:'1:1',
                value:1
              },
              {
                name:'3:2',
                value:3/2
              },
              {
                name:'4:5',
                value:4/5
              },
              {
                name:'5:4',
                value:5/4
              },
              {
                name:'7:5',
                value:7/5
              },
              {
                name:'16:9',
                value:16/9
              }
            ],
            cropWidth:undefined,
            cropHeight:undefined,
            value:1
          },
          rotation:{
            flipY:1,
            flipX:1,
          },
          drawLine:{
            name:'drawLine',
            mode:1,
            modeType:[
              {
                name:'Free drawing',
                value:1
              },
              {
                name:'Straight line',
                value:2
              }
            ],
            color:'#000000',
            size:2
          },
          text:{
            name:'text',
            color:'#000000',
            size:30,
            align:'left',
            alignType:['left','center','right'],
            bold:false,
            italic:false,
            underline:false,
          }
        }
      }
    },
  },
  mounted(){
    document.addEventListener('keyup',this.deleteCanvasObject)
  },
  beforeDestroy(){
    document.removeEventListener('keyup',this.deleteCanvasObject)
  },
  methods:{
    deleteCanvasObject(event){
      let that=this
      if(that.fabricCanvas&&that.fabricCanvas.getActiveObject()&&!that.fabricCanvas.getActiveObject().isEditing){
        if(event.keyCode==8||event.keyCode==46){
          that.fabricCanvas.remove(that.fabricCanvas.getActiveObject())
          that.clickObj=false
        }
      }
    },
    close(){
      this.$emit('close')
      console.log('触发关闭')
    },
    showMenu(type){
      switch(type){
        case 'crop':
          this.clickObj=false
          if(this.subMenu!='crop'&&this.subMenu!='rotation'){
            this.subMenu=type
            this.getFabricImage()
            let image = this.$refs.imageEditor;
            this.cropper.clear()
            this.cropper.destroy();
            this.cropper=null
            this.cropper = new Cropper(image,{
              aspectRatio: 1/1,
              viewMode:2,
              movable:false,
              zoomOnWheel:false,
              toggleDragModeOnDblclick:false,
              minCropBoxWidth:10,
              minCropBoxHeight:10,
            });
          }
          this.subMenu=type
          this.cropSelect(this.menu.crop.options[1])
        break;
        case 'rotation':
          this.clickObj=false
          if(this.subMenu!='crop'&&this.subMenu!='rotation'){
            this.subMenu=type
            this.getFabricImage()
            let image = this.$refs.imageEditor;
            this.cropper.clear()
            this.cropper.destroy();
            this.cropper=null
            this.cropper = new Cropper(image,{
              viewMode:2,
              movable:false,
              autoCrop:false,
              zoomOnWheel:false,
              dragMode:'move',
              toggleDragModeOnDblclick:false,
              minCropBoxWidth:10,
              minCropBoxHeight:10,
            });
            // this.cropper.setDragMode('move')
          }else{
            this.subMenu=type
          }
          this.rotateMode()
        // this.imageEditor.stopDrawingMode();
        break;
        case 'drawLine':
          // this.subMenu=type
          // this.initFabricEditorDraw()
          // this.menu.drawLine.mode=1
          if(this.subMenu!='drawLine'&&this.subMenu!='text'){
            this.subMenu=type
            console.log(this.fabricCanvas)
            if(!this.fabricCanvas){
              this.initFabricEditorDraw() 
            }else{
            this.menu.drawLine.mode = 1
            this.fabricCanvas.clear()
            let canvas=this.fabricCanvas
            fabric.Image.fromURL(this.loadingSrc, (img) => {
              if(img.width>this.canvas.width||img.height>this.canvas.height){
                if(img.width/this.canvas.width>=img.height/this.canvas.height){
                  this.scaling=this.canvas.width/img.width
                  img.set({
                    scaleX:this.scaling,
                    scaleY:this.scaling
                  });
                  this.ratito=this.canvas.width/img.width
                  canvas.setWidth(img.width*this.scaling)
                  canvas.setHeight(img.height*this.scaling)
                }else{
                  this.scaling=this.canvas.height/img.height
                  img.set({
                    scaleX:this.scaling,
                    scaleY:this.scaling
                  });
                  this.ratito=this.canvas.height/img.height
                  canvas.setWidth(img.width*this.scaling)
                  canvas.setHeight(img.height*this.scaling)
                }
              }else if(img.width<=this.canvas.width&&img.height<=this.canvas.height){
                if(this.canvas.width/img.width<=this.canvas.height/img.height){
                  this.scaling=this.canvas.width/img.width;
                  img.set({
                    scaleX:this.scaling,
                    scaleY:this.scaling,
                  });
                  canvas.setWidth(img.width*this.scaling)
                  canvas.setHeight(img.height*this.scaling)
                }else{
                  this.scaling=this.canvas.height/img.height;
                  img.set({
                    scaleX:this.scaling,
                    scaleY:this.scaling,
                  });
                  canvas.setWidth(img.width*this.scaling)
                  canvas.setHeight(img.height*this.scaling)
                }
              }
              //设置背景
              canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
              canvas.defaultCursor = 'crosshair';
              canvas.renderAll();
            },{crossOrigin:'Anonymous'});
            }
          }else{
            this.subMenu=type
            this.fabricCanvas.freeDrawingBrush.color = this.menu.drawLine.color
            this.fabricCanvas.freeDrawingBrush.width = this.menu.drawLine.size
            this.fabricCanvas.isDrawingMode = true
            this.fabricCanvas.selectable = false
            this.fabricCanvas.selection = false
            this.menu.drawLine.mode = 1
          }
        break;
        case 'text':
          if(this.subMenu!='drawLine'&&this.subMenu!='text'){
            this.subMenu=type
            if(!this.fabricCanvas){
              this.initFabricEditorText() 
            }else{
            this.menu.drawLine.mode = 3
            this.fabricCanvas.isDrawingMode = false
            this.fabricCanvas.selectable = true
            this.fabricCanvas.selection = false
            this.fabricCanvas.clear()
            let canvas=this.fabricCanvas        
            fabric.Image.fromURL(this.loadingSrc, (img) => {
              if(img.width>this.canvas.width||img.height>this.canvas.height){
                if(img.width/this.canvas.width>=img.height/this.canvas.height){
                  this.scaling=this.canvas.width/img.width
                  img.set({
                    scaleX:this.scaling,
                    scaleY:this.scaling
                  });
                  this.ratito=this.canvas.width/img.width
                  canvas.setWidth(img.width*this.scaling)
                  canvas.setHeight(img.height*this.scaling)
                }else{
                  this.scaling=this.canvas.height/img.height
                  img.set({
                    scaleX:this.scaling,
                    scaleY:this.scaling
                  });
                  this.ratito=this.canvas.height/img.height
                  canvas.setWidth(img.width*this.scaling)
                  canvas.setHeight(img.height*this.scaling)
                }
              }else if(img.width<=this.canvas.width&&img.height<=this.canvas.height){
                if(this.canvas.width/img.width<=this.canvas.height/img.height){
                  this.scaling=this.canvas.width/img.width;
                  img.set({
                    scaleX:this.scaling,
                    scaleY:this.scaling,
                  });
                  canvas.setWidth(img.width*this.scaling)
                  canvas.setHeight(img.height*this.scaling)
                }else{
                  this.scaling=this.canvas.height/img.height;
                  img.set({
                    scaleX:this.scaling,
                    scaleY:this.scaling,
                  });
                  canvas.setWidth(img.width*this.scaling)
                  canvas.setHeight(img.height*this.scaling)
                }
              }
              //设置背景
              canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
              canvas.defaultCursor = 'crosshair';
              canvas.renderAll();
            },{crossOrigin:'Anonymous'});
            }
          }else{
            this.subMenu=type
            this.fabricCanvas.isDrawingMode = false
            this.fabricCanvas.selectable = true
            this.fabricCanvas.selection = false
            this.menu.drawLine.mode = 3
          }
        break;
      }
    },
    toggleEditor(type){
      if(this.mode=="cropper"){
        //切换成fabric模式
      }
    },
    //初始化图片编辑器
    initCropperEditor(){
      const image = this.$refs.imageEditor;
      this.cropper = new Cropper(image, this.options);
    },
    dataURLtoBlob(dataurl){
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while(n--){
              u8arr[n] = bstr.charCodeAt(n);
            }
      return new Blob([u8arr], {type:mime});
    },
    _crop_cancel(){
      this.cropper.clear()
    },
    cropSelect(item){
      this.menu.crop.name=item.name
      this.menu.crop.value=item.value
      this.cropper.setDragMode("crop")
      this.cropper.setAspectRatio(item.value)
      this.cropper.crop()
    },
    _crop_apply(){
      this.getCropperImage()
    },
    rotateMode(){
      this.cropper.clear()
      this.cropper.setDragMode('move')
    },
    rotate(deg){
      this.cropper.rotate(deg)
      this.loadingSrc=this.newSrc=this.cropper.getCroppedCanvas().toDataURL()
    },
    flip(direction){
      if(direction=="x"){
        this.cropper.scaleX(-this.menu.rotation.flipX)
        this.menu.rotation.flipX=-this.menu.rotation.flipX
      }else{
        this.cropper.scaleY(-this.menu.rotation.flipY)
        this.menu.rotation.flipY=-this.menu.rotation.flipY
      }
      this.loadingSrc=this.newSrc=this.cropper.getCroppedCanvas().toDataURL()
    },
    getCropperImage(canvas=false){
      let image = this.$refs.imageEditor;
      if(canvas){
        this.cropper.clear()
      }
      this.loadingSrc=this.newSrc=image.src=this.cropper.getCroppedCanvas().toDataURL()
      console.log(image.src)
      // console.log(this.newSrc=this.cropper.getCroppedCanvas().toDataURL())
      // this.loadingSrc=this.newSrc=this.cropper.getCroppedCanvas().toDataURL()
      this.cropper.destroy();
      this.cropper=null
      console.log(this.menu.crop.value)
      this.cropper = new Cropper(image,{
        aspectRatio: this.menu.crop.value,
        viewMode:2,
        movable:false,
        zoomOnWheel:false,
        toggleDragModeOnDblclick:false,
        minCropBoxWidth:10,
        minCropBoxHeight:10,
        // minCanvasWidth: 500,
        crop(event) {
          console.log(event.detail.x);
          console.log(event.detail.y);
          console.log(event.detail.width);
          console.log(event.detail.height);
          console.log(event.detail.rotate);
          console.log(event.detail.scaleX);
          console.log(event.detail.scaleY);
        },
      });
      this.cropper.clear()
      // this.cropper.viewMode=2
    },
    _drawFree(){
      this.menu.drawLine.mode=1;
      this.fabricCanvas.freeDrawingBrush.color = this.menu.drawLine.color
      this.fabricCanvas.freeDrawingBrush.width = this.menu.drawLine.size
      this.drawing()
      // this.fabricCanvas.isDrawingMode = true
    },
    _drawLine(){
      this.menu.drawLine.mode=2;
      // this.drawing()
      this.fabricCanvas.isDrawingMode = false
    },
    drawing(){
      if(this.drawingObject) {
        this.fabricCanvas.remove(this.drawingObject)
      }
      let canvasObject = null
      switch(this.menu.drawLine.mode){
        case 1:
          this.fabricCanvas.isDrawingMode = true
          break;
        case 2:
          this.fabricCanvas.isDrawingMode = false
          this.fabricCanvas.selectable = false
          this.fabricCanvas.selection = false
          this.fabricCanvas.skipTargetFind = true
          canvasObject = new fabric.Line([this.mouseFrom.x,this.mouseFrom.y,this.mouseTo.x,this.mouseTo.y],{
            stroke: this.menu.drawLine.color,
            strokeWidth: this.menu.drawLine.size
          }) 
          break;
      }
      if(canvasObject) {
        this.fabricCanvas.add(canvasObject)
        this.drawingObject = canvasObject;
      }
    },
    _drawStyle(){
      if(this.menu.drawLine.mode=1){
        this._drawFree()
      }
    },
    initFabricEditor(){
      let canvas = this.fabricCanvas = new fabric.Canvas('fabricEditor',{
        selection:false
      })
      this.fabricLoading=true
      fabric.Image.fromURL(this.loadingSrc, (img) => {
        if(img.width>this.canvas.width||img.height>this.canvas.height){
          if(img.width/this.canvas.width>=img.height/this.canvas.height){
            this.scaling=this.canvas.width/img.width
            img.set({
              scaleX:this.scaling,
              scaleY:this.scaling
            });
            this.ratito=this.canvas.width/img.width
            canvas.setWidth(img.width*this.scaling)
            canvas.setHeight(img.height*this.scaling)
          }else{
            this.scaling=this.canvas.height/img.height
            img.set({
              scaleX:this.scaling,
              scaleY:this.scaling
            });
            this.ratito=this.canvas.height/img.height
            canvas.setWidth(img.width*this.scaling)
            canvas.setHeight(img.height*this.scaling)
          }
        }else if(img.width<=this.canvas.width&&img.height<=this.canvas.height){
          if(this.canvas.width/img.width<=this.canvas.height/img.height){
            this.scaling=this.canvas.width/img.width;
            img.set({
              scaleX:this.scaling,
              scaleY:this.scaling,
            });
            canvas.setWidth(img.width*this.scaling)
            canvas.setHeight(img.height*this.scaling)
          }else{
            this.scaling=this.canvas.height/img.height;
            img.set({
              scaleX:this.scaling,
              scaleY:this.scaling,
            });
            canvas.setWidth(img.width*this.scaling)
            canvas.setHeight(img.height*this.scaling)
          }
        }
        //设置背景
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        canvas.defaultCursor = 'crosshair';
        canvas.renderAll();
        this.fabricLoading=false
      },{crossOrigin:'anonymous'});
      let _this=this
      this.fabricCanvas.on({
          'mouse:down': (o)=> {
            this.mouseFrom.x = o.e.offsetX;
            this.mouseFrom.y = o.e.offsetY;
            this.doDrawing = true;
            // this.clickObj=o.target
            console.log(this.clickObj)
            if(this.fabricCanvas.getActiveObject()!=null){
              this.clickObj=true
            }
            console.log(this.clickObj,this.fabricCanvas.getActiveObject())
          },
          'mouse:up': (o)=> {
            console.log(this.clickObj)
            if(this.clickObj&&this.fabricCanvas.getActiveObject()==null){
              return this.clickObj=false
            }
            this.mouseTo.x = o.e.offsetX;
            this.mouseTo.y = o.e.offsetY;
            this.drawingObject = null;
            this.moveCount = 1;
            this.doDrawing = false;
            if(this.menu.drawLine.mode==3&&!this.clickObj){
              console.log('添加了')
              this.addText()
            }else if(this.menu.drawLine.mode==3&&this.clickObj&&this.fabricCanvas.getActiveObject().textAlign){
              //读取文本信息到菜单
              this.menu.text.size=this.fabricCanvas.getActiveObject().fontSize // 字体大小
              this.menu.text.bold=this.fabricCanvas.getActiveObject().fontWeight=='bold'?true:false,// 字体粗细
              this.menu.text.color=this.fabricCanvas.getActiveObject().fill  // 字体颜色
              this.menu.text.italic=this.fabricCanvas.getActiveObject().fontStyle== 'italic'?true:false // 斜体
              this.menu.text.underline=this.fabricCanvas.getActiveObject().underline
              this.menu.text.align=this.fabricCanvas.getActiveObject().textAlign
              console.log(this.menu.text)
            }
          },
          'mouse:move': (o)=> {
            if (_this.moveCount % 2 && !_this.doDrawing) {
              //减少绘制频率
              return;
            }
            this.moveCount++;
            this.mouseTo.x = o.e.offsetX;
            this.mouseTo.y = o.e.offsetY;
            if(this.menu.drawLine.mode<3){
              this.drawing();
            }
          },
          'object:moving': (e)=> {
            e.target.opacity = 0.5;
          },
          'object:added': (e)=>{
            let object = e.target;
            // if(!this.controlFlag) {
            //   this.redo = []
            // }
            // this.controlFlag = false
          },
          'object:modified':(e)=> {
            e.target.opacity = 1;
            let object = e.target;
          },
        });
    },
    initFabricEditorDraw(){
      this.initFabricEditor() 
      this.fabricCanvas.freeDrawingBrush.color = this.menu.drawLine.color
      this.fabricCanvas.freeDrawingBrush.width = this.menu.drawLine.size
      this.fabricCanvas.isDrawingMode = true
      this.fabricCanvas.selectable = false
      this.fabricCanvas.selection = false
      this.menu.drawLine.mode = 1
    },
    initFabricEditorText(){
      this.initFabricEditor() 
      this.fabricCanvas.isDrawingMode = false
      this.fabricCanvas.selectable = true
      this.fabricCanvas.selection = false
      this.menu.drawLine.mode = 3
    },
    addText(){
      let textbox = new fabric.IText('默认文字', {
        left: this.mouseFrom.x,
        top: this.mouseFrom.y,
        // width: 150,
        fontSize: this.menu.text.size, // 字体大小
        fontWeight: this.menu.text.bold?'bold':'normal', // 字体粗细
        fill: this.menu.text.color, // 字体颜色
        fontStyle: this.menu.text.italic?'italic':'normal',  // 斜体
        underline:this.menu.text.underline,
        textAlign:this.menu.text.align,
        // fontFamily: 'Delicious', // 设置字体
        // stroke: 'green', // 描边颜色
        // strokeWidth: 3, // 描边宽度
        hasControls: true,
        cornerColor:'#1a1d2c',
        cornerSize:8,
        borderColor: '#1a1d2c',
        transparentCorners:false,
        cornerStyle:'circle',
        editingBorderColor: '#1a1d2c' // 点击文字进入编辑状态时的边框颜色
      });
      // textbox.enterEditing();
      this.fabricCanvas.add(textbox);
    },
    _changeTextStyle(styleType='b'){
            switch (styleType) {
        case 'b':
          console.log(this.fabricCanvas.getActiveObject())
          if(this.fabricCanvas.getActiveObject()&&this.fabricCanvas.getActiveObject().textAlign){
            this.fabricCanvas.getActiveObject().set('fontWeight',this.menu.text.bold?'bold':'normal')
          }
          break;
        case 'i':
          if(this.fabricCanvas.getActiveObject()&&this.fabricCanvas.getActiveObject().textAlign){
            this.fabricCanvas.getActiveObject().set('fontStyle',this.menu.text.italic?'italic':'normal')
          }
          break;
        case 'u':
          if(this.fabricCanvas.getActiveObject()&&this.fabricCanvas.getActiveObject().textAlign){
            this.fabricCanvas.getActiveObject().set('underline',this.menu.text.underline)
          }
          break;
        case 'l':
          if(this.fabricCanvas.getActiveObject()&&this.fabricCanvas.getActiveObject().textAlign){
            this.fabricCanvas.getActiveObject().set('textAlign',this.menu.text.align)
          }
          break;
        case 'c':
          if(this.fabricCanvas.getActiveObject()&&this.fabricCanvas.getActiveObject().textAlign){
            this.fabricCanvas.getActiveObject().set('textAlign',this.menu.text.align)
          }
          break;
        case 'r':
          if(this.fabricCanvas.getActiveObject()&&this.fabricCanvas.getActiveObject().textAlign){
            this.fabricCanvas.getActiveObject().set('textAlign',this.menu.text.align)
          }
          break;
        case 'f':
          if(this.fabricCanvas.getActiveObject()&&this.fabricCanvas.getActiveObject().textAlign){
            this.fabricCanvas.getActiveObject().set('fill',this.menu.text.color)
          }
          break;
        case 's':
          if(this.fabricCanvas.getActiveObject()&&this.fabricCanvas.getActiveObject().textAlign){
            this.fabricCanvas.getActiveObject().set('fontSize',this.menu.text.size)
          }
          break;
        default:
          break;
        } 
        this.fabricCanvas.renderAll()
    },
    getFabricImage(){
      let image = this.$refs.imageEditor;
      console.log(this.scaling)
      this.loadingSrc=this.newSrc=image.src=this.fabricCanvas.toDataURL({
        multiplier:1/this.scaling
      })
    },
    //读取文件内容进行MD5加密
    get_filemd5sum(ofile) {
        return  new Promise((resolve, reject)=>{
         let file = ofile;
          let tmp_md5;
          let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
              chunkSize = 8097152, // Read in chunks of 2MB
              chunks = Math.ceil(file.size / chunkSize),
              currentChunk = 0,
              spark = new SparkMD5.ArrayBuffer(),
              fileReader = new FileReader();
              fileReader.onload = async (e) =>{
                spark.append(e.target.result); // Append array buffer
                currentChunk++;
                let md5_progress = Math.floor((currentChunk / chunks) * 100);
                console.log(file.name + "  正在处理，请稍等," + "已完成" + md5_progress + "%");
                if (currentChunk < chunks) {
                  loadNext();
                } else {
                  tmp_md5 = spark.end();
                  resolve(tmp_md5)
                    console.log(file.name + "的MD5值是：" + tmp_md5)
                }
              };
              fileReader.onerror = function() {
                reject(false)
                console.warn('oops, something went wrong.');
              };
              function loadNext() {
                let start = currentChunk * chunkSize,
                    end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
                fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
              }
              loadNext(tmp_md5); 
       })
    },
    //与后台MD5进行对比，是否上传过，上传过返回存在的图片
    async queryExsit(MD5){
        let res =await this.$http.postJson('/common/upload/check-upload',{
          md5:MD5
        })
        console.log('imgEditor-index');
        if(res.data.code===0){
          if(res.data.is_uploaded===1){
            this.aliOssConfig=res.data.config
            return res.data.file
          }else{
            this.aliOssConfig=res.data.config
            return false
          }
        }else{
          return false
        }
    },
    async uploadToOss(file,MD5){
      let url=""
      let imgObj=""
      let client = new OSS(this.aliOssConfig)
      let suffix=file.type.split('/')[file.type.split('/').length-1]
      let fileName=SparkMD5.hash((new Date().getTime()+MD5))+'.'+suffix
      console.log('要上传到阿里云的图片',file.name,suffix,fileName)

      let data="";
      try{
        data=await client.multipartUpload('uploader/'+fileName, file, {}).catch(fail=>{
          this.$message.error(fail.toString())
          data=false
          return false
        })
        console.log('上传OSS成功之前的data',data)
        if(data&&data.res&&data.res.status===200&&data.res.requestUrls.length){
          console.log('上传成功',data.name,data)  
          url= data.res.requestUrls[0]
        }else{
          return false
        }
      }catch(e){
        console.log('上传失败',e)  
        //上传阿里云失败
        return false
      }
      if(url){
        let res =await this.$http.postJson('/sail/upload/get-file-id',{
          md5:MD5,
          file_key:'uploader/'+fileName,
        })
        if(res.data.code===0){
          imgObj=res.data.data
          return imgObj
        }
      }
      return false
    },
    //单个上传
    async upload(blob){
        //读取文件MD5值
      this.loading=true
      let MD5=await this.get_filemd5sum(blob)
      if(MD5){
        let img = await this.queryExsit(MD5)
        if(img){
          console.log(img,'已经上传过')
          this.$emit('save',img)
        }else{
          let imgObj= await this.uploadToOss(blob,MD5)
          if(imgObj){
            console.log('此图片已经过验证，未有上传过阿里OSS,已经上传到阿里服务器',imgObj)
            this.$emit('save',imgObj)
          }else{
            this.$message.error('fail')
          }
        }
      }
      this.loading=false
    },
    async save(){
      let blob
      if(this.subMenu=="crop"||this.subMenu=="rotation"){
        // this.cropper.clear()
        blob=this.dataURLtoBlob(this.cropper.getCroppedCanvas().toDataURL()) 
      }else{
        blob=this.dataURLtoBlob(this.fabricCanvas.toDataURL({multiplier:1/this.scaling})) 
      }
      this.upload(blob)
    },
    destroy(){
      this.clickObj=false
      if(this.cropper){
        this.cropper.clear()
        this.cropper.destroy()
        this.cropper=null
      }
      if(this.fabricCanvas){
        // this.fabricCanvas
        // this.fabricCanvas.dispose()
        this.fabricCanvas=null
        document.querySelector('.fabric-editor').innerHTML=`<canvas id="fabricEditor" width="500" height="300" style="max-width: 100%;"></canvas>`
      }
    }
  },
   computed: {
        ...mapGetters(["aliOssConfig"]),
    },
  components:{
    num
  }
}

</script>
<style lang='scss'>
.img-edit-dialog{
  .editor-area{
    min-height: 320px;
    .canvas-container{
       margin:0 auto;
    }
    .tui-image-editor-canvas-container{
      margin:0 auto;
      border:1px dashed #bbb
    }
    .img-container{
      position: relative;
      width:100%;
      height:300px;
      margin-bottom:20px;
      .image-editor{
        // margin: 0 auto;
        width:500px;
        height:300px;
        display:flex;
        align-items: center;
        position: absolute;
        
      }
      .cropper-editor{
        transform: translateX(-50%);
        left:50%;
        z-index:2,
      }
      .fabric-editor{
        transform: translateX(-50%);
        left:50%;
        z-index:1;
        background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');
      }
    }
    .image-controls{
      margin:0 -20px;
      padding:10px 20px; 
      user-select: none;
      background: linear-gradient(180deg,rgba(247,247,247,1) 0%,rgba(255,255,255,1) 100%);
      .menu{
        border-bottom: 1px solid #DCDDEB;
        padding-bottom: 10px;
        margin-bottom: 20px;
        .crop_items{
          color:#ABB7C4;
          min-height: 62px;
          justify-content: center;
          .items .item{
            // padding:8px 8px 2px 8px;
            // width:40px;
            // height:26px;
            padding-bottom:5px;
            display: inline-block;
            border: 2px solid #ABB7C4;
            border-radius:2px;
            margin:0 16px;
            font-size: 14px;
            text-align: center;
            vertical-align: bottom;
            cursor: pointer;
            &.active{
              border-color:#34395D;
              color:#34395D;
              // padding: 12px 8px 2px 8px;
            }
          }
          dl{
            text-align: center
          }
          .active{
            color: #34395D; 
          }
        }
      }
      .submenu{
        justify-content: center;
        i {
          font-size: 28px;
          padding: 10px;
          color:#ABB7C4;
          margin:0 14px;
          cursor: pointer;
          &.active{
            color: #FFFFFF;
            background: #34395D;
            border-radius:4px;
          }
        }
      }
    }
  }
  .el-slider__runway{
    height:2px;
    .el-slider__button-wrapper{
      width:20px;
      height:20px;
      top:-8px;
    }
    .el-slider__bar{
      height: 2px;
      background-color: #34395D;
    }
    .el-slider__button{
      width: 10px;
      height:10px;
      border:1px solid #34395D
    }
  }
}
</style>