package com.jayqqaa12.common;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

import javax.imageio.ImageIO;

import net.coobird.thumbnailator.Thumbnails;

import com.google.common.collect.Lists;
import com.jayqqaa12.Code;
import com.jayqqaa12.jbase.jfinal.ext.ctrl.JsonController;
import com.jayqqaa12.jbase.sdk.util.ImageKit;
import com.jayqqaa12.jbase.util.Fn;
import com.jayqqaa12.jbase.util.Sec;
import com.jayqqaa12.jbase.util.upload.FlashUpload;
import com.jayqqaa12.jbase.util.upload.KindEditor;
import com.jayqqaa12.model.json.SendJson;
import com.jfinal.ext.route.ControllerBind;
import com.jfinal.upload.UploadFile;

@ControllerBind(controllerKey = "/common/file")
public class FileCtrl extends JsonController {
	
	
	public void flashUpload(){
		renderJson(FlashUpload.flashUpload(getRequest()));
	}
	

	public void kindEidtorUpload() {
		renderJson(KindEditor.upload(this));
	}

	public void kindEidtorFileManage() {
		renderJson(KindEditor.fileManage(getRequest()));
	}

	
	/**
	 * 上传图片 自动缩放 默认png  
	 * TODO 生产 环境 可以存图片到 文件服务器
	 * @throws FileNotFoundException
	 * @throws IOException
	 */
	public void uploadImg() throws FileNotFoundException, IOException {

		int code = 200;
		SendJson json = getJsonObject();
		UploadFile f = getFile();
		int w = getParaToInt("w");
		int h = getParaToInt("h");

		String fileName = Sec.MD5Encrypt(UUID.randomUUID().toString(), 16) + ".png";

		if (f.getFile().exists()) {
			Thumbnails.of(f.getFile()).size(w, h).keepAspectRatio(false).toFile(new File(f.getSaveDirectory()+File.separator + fileName));
			f.getFile().delete();
		}

		json.setData("img", "/upload/" + fileName);

		json.code = code;
		sendJson(json);
	}
	
	
	
	
	/**
	 * 保存原图
	 * 
	 * 会返回错误码
	 * 
	 * 这里必需 要上传 指定的 大小 w h
	 * 
	 * 
	 * @throws IOException
	 * 
	 */
	public void uploadImgs() throws IOException {

		int w = getParaToInt("w");
		int h = getParaToInt("h");
		String type = getPara("type");
		int code = 200;
		SendJson json = getJsonObject();
		List<UploadFile> files = getFiles();

		List<String> imgs = Lists.newArrayList();

		for (UploadFile file : files) {

			String name = Sec.MD5Encrypt(UUID.randomUUID().toString(), 16) + "." + type;
			BufferedImage image = ImageIO.read(file.getFile());
			String end = ImageKit.getFormatName(file.getFile());

			if (type != null && !end.equals(type)) {
				code = Code.FILE_TYPE_ERROR;
				continue;
			}

			if (image.getWidth() != w || image.getHeight() != h) {
				code = Code.IMG_SIZE_ERROR;
				continue;
			}
			if (code == 200) {
				String dir = file.getSaveDirectory() + "/" + name;
				Fn.rename(file.getFile(), dir);
				imgs.add("/upload"  + name);
			}

		}

		json.setData("imgs", imgs);

		json.code = code;
		sendJson(json);

	}
	
	
	
	
	

}
