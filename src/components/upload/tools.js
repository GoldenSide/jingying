import OSS from "ali-oss";
import SparkMD5 from "spark-md5";
import ossMixIn from "@/mixins/ossMixin";

export default {
  mixins: [ossMixIn],
  data() {
    return {};
  },
  created() {},
  methods: {
    uploadToOssSuccess(param) {
      let file = param.file;
      let MD5 = null;
      this.get_filemd5sum(file).then(res => {
        MD5 = res;
        if (MD5) {
          this.uploadToOss(file, MD5).then(res => {
            param.onSuccess(res);
          });
        }
      });
    },
    // 图片上传配置
    get_filemd5sum(ofile) {
      return new Promise((resolve, reject) => {
        let file = ofile;
        let tmp_md5;
        let blobSlice =
            File.prototype.slice ||
            File.prototype.mozSlice ||
            File.prototype.webkitSlice,
          chunkSize = 8097152, // Read in chunks of 2MB
          chunks = Math.ceil(file.size / chunkSize),
          currentChunk = 0,
          spark = new SparkMD5.ArrayBuffer(),
          fileReader = new FileReader();
        fileReader.onload = async e => {
          spark.append(e.target.result); // Append array buffer
          currentChunk++;
          let md5_progress = Math.floor((currentChunk / chunks) * 100);
          if (currentChunk < chunks) {
            loadNext();
          } else {
            tmp_md5 = spark.end();
            resolve(tmp_md5);
          }
        };
        fileReader.onerror = function() {
          reject(false);
        };
        function loadNext() {
          let start = currentChunk * chunkSize,
            end =
              start + chunkSize >= file.size ? file.size : start + chunkSize;
          fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
        }
        loadNext(tmp_md5);
      });
    },
    uploadToOss(file, MD5) {
      return new Promise((resolve, reject) => {
        let str = "",
          url = "",
          client = null,
          fileName = null,
          suffix = null,
          index = 0;
        this.initOssConfig().then(res => {
          if (res && Object.keys(res).length > 0) {
            client = new OSS(res);
            suffix = file.name.split(".")[file.name.split(".").length - 1];
            fileName =
              SparkMD5.hash(new Date().getTime() + file.name) + "." + suffix;
            client
              .multipartUpload("uploader/" + fileName, file, {}, {})
              .then(data => {
                if (data.res.requestUrls.length) {
                  str = data.res.requestUrls[0];
                  index = str.indexOf("?");
                  url = index > 0 ? str.substring(0, index) : str;
                  resolve({ file_preview: url });
                }
                reject("上传失败");
              });
          } else {
            this.$message.error("获取oss秘钥失败，请刷新重试");
          }
        });
      });
    },

  }
};
