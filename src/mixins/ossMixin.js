import { getOssConfig } from "@/api/common";
export default {
  data() {
    return {
      aliOssConfig: {
        region: "",
        accessKeyId: "",
        accessKeySecret: "",
        stsToken: "",
        bucket: ""
      }
    };
  },
  created() {},
  methods: {
    initOssConfig() {
      return new Promise((resolve, reject) => {
        getOssConfig()
          .then(res => {
            let {
              region,
              security_token: stsToken,
              access_key_id: accessKeyId,
              access_key_secret: accessKeySecret,
              bucket
            } = res.data;
            let config = {
              ...this.aliOssConfig,
              ...{ region, stsToken, bucket, accessKeyId, accessKeySecret }
            };
            resolve(config);
          })
          .catch(err => {
            reject(err);
          });
      });
    }
  }
};
