var styleRenderers = {};

var currentStyle = "twFabric";
var imageExtension = ".png";

var exportSize = [1920, 1080];
var exportCanvas = document.querySelector("#export");

// THEORYWEAR
styleRenderers.twFabric = function(canvas, isPreview) {
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	var finish = prop("finish");

	// var path = imgPath("1_" + finish + (isPreview ? "_preview" : ""));
	var patImg = new Image();
	
	var geom = prop("model");
	var pat = prop("pattern");
	var patPath = imgPath(geom + "_" + pat + (isPreview ? "_preview" : ""));

	patImg.onload = function() {
		ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
		
		
		ctx.globalCompositeOperation = "source-in";
		ctx.fillStyle = prop("texColor");
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.globalCompositeOperation = "source-over";
		
		function continueDrawing() {
			ctx.globalCompositeOperation = "destination-over";
			ctx.fillStyle = prop("texBg");
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			
			var mattePath = imgPath(geom + "_diffuse" + (isPreview ? "_preview" : ""));
			var matte = new Image();
			
			matte.onload = function() {
				ctx.globalCompositeOperation = "multiply";
				ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
				
				var finish = prop("finish");
				
				if (finish != "matte") {
					var finPath = imgPath(geom + "_" + finish + (isPreview ? "_preview" : ""));
					var fin = new Image();
					
					fin.onload = function() {
						ctx.globalCompositeOperation = "screen";
						ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
						ctx.globalCompositeOperation = "multiply";
						ctx.fillStyle = prop("light");
						ctx.fillRect(0, 0, canvas.width, canvas.height);
						ctx.globalCompositeOperation = "source-over";
						finishExporting(isPreview);
					}
					fin.src = finPath;
				} else {
					finishExporting(isPreview);
				}
			}
			matte.src = mattePath;
		}
		
		if (pat == "tw18summer") {
			var neutPath = imgPath(geom + "_" + pat + "_n" + (isPreview ? "_preview" : ""));
			var neut = new Image();
			
			neut.onload = function() {
				ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
				continueDrawing();
			}
			neut.src = neutPath;
		} else {
			continueDrawing();
		}

		// finishExporting(isPreview);
	}

	patImg.src = patPath;
}
// 10M RE-RELEASE
styleRenderers.ridges = function(canvas, isPreview) {
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	var path = imgPath(prop("angle") + "_" + prop("finish") + (isPreview ? "_preview" : ""));
	var img = new Image();

	img.onload = function() {
		ctx.drawImage(this, 0, 0, canvas.width, canvas.height);

		ctx.fillStyle = prop("color");
		ctx.globalCompositeOperation = "multiply";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.globalCompositeOperation = "source-over";

		finishExporting(isPreview);
	}

	img.src = path;
}
styleRenderers.ribbon = function(canvas, isPreview) {
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	var path = imgPath(prop("theme") + "_" + prop("geom") + "_" + prop("angle") + (isPreview ? "_preview" : ""));
	var img = new Image();

	img.onload = function() {
		ctx.drawImage(this, 0, 0, canvas.width, canvas.height);

		ctx.fillStyle = prop("color2");
		ctx.globalCompositeOperation = "screen";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.fillStyle = prop("color1");
		ctx.globalCompositeOperation = "multiply";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.globalCompositeOperation = "source-over";

		finishExporting(isPreview);
	}

	img.src = path;
}
styleRenderers.domainColoring = function(canvas, isPreview) {
	var ctx = canvas.getContext("2d");

	var path = imgPath(prop("angle") + (isPreview ? "_preview" : ""));
	var img = new Image();

	img.onload = function() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
		
		ctx.globalCompositeOperation = "source-in";
		ctx.fillStyle = prop("color2");
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.globalCompositeOperation = "destination-over";
		ctx.fillStyle = prop("color1");
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		ctx.globalCompositeOperation = "source-over";
		
		finishExporting(isPreview);
	}

	img.src = path;
}
styleRenderers.gradient = function(canvas, isPreview) {
	var ctx = canvas.getContext("2d");

	var path = imgPath(prop("var") + (isPreview ? "_preview" : ""));
	var img = new Image();

	img.onload = function() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
		
		ctx.globalCompositeOperation = "source-in";
		ctx.fillStyle = prop("color2");
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.globalCompositeOperation = "destination-over";
		ctx.fillStyle = prop("color1");
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		ctx.globalCompositeOperation = "source-over";
		
		finishExporting(isPreview);
	}

	img.src = path;
}
styleRenderers.dotMatrix = function(canvas, isPreview) {
	var ctx = canvas.getContext("2d");

	var bgPath = imgPath("bg_" + prop("view") + (isPreview ? "_preview" : ""));
	var img = new Image();

	img.onload = function() {
		if (prop("theme") == "invert")
			ctx.filter = "invert(1)";
		ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
		ctx.filter = "none";
		
		// color stuff hier
		ctx.globalCompositeOperation = "multiply";
		
		if (prop("fill") == "solid") {
			ctx.fillStyle = prop("color1");
		} else if (prop("fill") == "gradient") {
			var radius = Math.hypot(canvas.width / 2, canvas.height / 2);
			var angle = prop("angle") * (Math.PI / 180);
			
			var gradient = ctx.createLinearGradient(
				canvas.width / 2 - Math.cos(angle) * radius,
				canvas.height / 2 - Math.sin(angle) * radius,
				canvas.width / 2 + Math.cos(angle) * radius,
				canvas.height / 2 + Math.sin(angle) * radius
			);
			
			gradient.addColorStop(0, prop("color1"));
			gradient.addColorStop(1, prop("color2"));
			ctx.fillStyle = gradient;
		}
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		
		// ctx.globalCompositeOperation = "source-in";
		// ctx.fillStyle = prop("color2");
		// ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		// var imgUrl = canvas.toDataURL();
		
		// var data = ctx.getImageData(0, 0, canvas.width, canvas.height);
		// console.log(data);
		
		// ctx.clearRect(0, 0, canvas.width, canvas.height);
		// ctx.globalCompositeOperation = "source-over";
		// ctx.fillStyle = prop("color1");
		// ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		var mxImg = new Image();
		
		mxImg.onload = function() {
			ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
			ctx.globalCompositeOperation = "source-over";
			
			finishExporting(isPreview);
		}
		mxImg.src = imgPath("mx_" + prop("matrix") + (isPreview ? "_preview" : ""));
	}

	img.src = bgPath;
}
// 11M RE-RELEASE
styleRenderers.nTrophy = function(canvas, isPreview) {
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	var redURL, greenURL;	
	
	var rPath = imgPath(prop("fmat") + "_" + prop("tmat") + "_r" + (isPreview ? "_preview" : ""));
	var rImg = new Image();

	rImg.onload = function() {
		ctx.drawImage(this, 0, 0, canvas.width, canvas.height);

		ctx.fillStyle = prop("color1");
		ctx.globalCompositeOperation = "multiply";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		redURL = canvas.toDataURL();

		var gPath = imgPath(prop("fmat") + "_" + prop("tmat") + "_g" + (isPreview ? "_preview" : ""));
		var gImg = new Image();

		gImg.onload = function() {
			ctx.globalCompositeOperation = "source-over";
			ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
			
			ctx.fillStyle = prop("color2");
			ctx.globalCompositeOperation = "multiply";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			
			greenURL = canvas.toDataURL();
			
			bPath = imgPath(prop("fmat") + "_" + prop("tmat") + "_b" + (isPreview ? "_preview" : ""));
			var bImg = new Image();

			bImg.onload = function() {
				ctx.globalCompositeOperation = "source-over";
				ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
				
				ctx.fillStyle = prop("color3");
				ctx.globalCompositeOperation = "multiply";
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				
				ctx.globalCompositeOperation = "screen";
				
				var r_Img = new Image();
				r_Img.onload = function() {
					ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
					
					var g_Img = new Image();
					g_Img.onload = function() {
						ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
						ctx.globalCompositeOperation = "source-over";
						finishExporting(isPreview);
					}
					g_Img.src = greenURL;
				}
				r_Img.src = redURL;
			}
			bImg.src = bPath;
		}
		gImg.src = gPath;
	}

	rImg.src = rPath;
}
styleRenderers.nSurface = function(canvas, isPreview) {
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	var tURL;
	
	var tMat = imgPath(prop("tmat") + (isPreview ? "_preview" : ""));
	var tMatImg = new Image();

	tMatImg.onload = function() {
		ctx.drawImage(this, 0, 0, canvas.width, canvas.height);

		ctx.fillStyle = prop("tcolor");
		ctx.globalCompositeOperation = "multiply";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		tURL = canvas.toDataURL();
		
		var fMat = imgPath(prop("fmat") + (isPreview ? "_preview" : ""));
		var fMatImg = new Image();
		
		fMatImg.onload = function() {
			ctx.globalCompositeOperation = "source-over";
			ctx.drawImage(this, 0, 0, canvas.width, canvas.height);

			ctx.fillStyle = prop("fcolor");
			ctx.globalCompositeOperation = "multiply";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			
			var tPath = imgPath("logo_" + prop("design") + (isPreview ? "_preview" : ""));
			var tImg = new Image();
			
			tImg.onload = function() {
				var w = (600 / 1920) * canvas.width * prop("scale");
				
				ctx.globalCompositeOperation = "destination-out";
				ctx.drawImage(this, (canvas.width - w) / 2, (canvas.height - w) / 2, w, w);

				var ciImg = new Image();
			
				ciImg.onload = function() {
					ctx.globalCompositeOperation = "destination-over";
					
					ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
					
					ctx.fillStyle = prop("light");
					ctx.globalCompositeOperation = "multiply";
					ctx.fillRect(0, 0, canvas.width, canvas.height);
					
					ctx.globalCompositeOperation = "source-over";
					
					finishExporting(isPreview);
				}
				
				ciImg.src = tURL;
			}
			
			tImg.src = tPath;
		}
		
		fMatImg.src = fMat;
	}

	tMatImg.src = tMat;
}
styleRenderers.twNTS = function(canvas, isPreview) {
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	ctx.fillStyle = prop("color1");
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	var burstRadius = Math.hypot(canvas.width * 0.7, canvas.height * 0.7);
	var burstAngle = 0.1;
	var burstTwist = +prop("twist");
	
	// Burst 1
	ctx.beginPath();
	for (var a = 0; a < 16; a++) {
		var angle = (a / 16) * Math.PI * 2;
		
		// no twist for now
		ctx.moveTo(canvas.width / 2, canvas.height / 2);
		ctx.quadraticCurveTo(
			canvas.width / 2 + burstRadius * Math.cos(angle - burstAngle + burstTwist) * 0.3,
			canvas.height / 2 + burstRadius * Math.sin(angle - burstAngle + burstTwist) * 0.3,
			canvas.width / 2 + burstRadius * Math.cos(angle - burstAngle),
			canvas.height / 2 + burstRadius * Math.sin(angle - burstAngle)
		);
		ctx.lineTo(
			canvas.width / 2 + burstRadius * Math.cos(angle + burstAngle),
			canvas.height / 2 + burstRadius * Math.sin(angle + burstAngle)
		);
		ctx.quadraticCurveTo(
			canvas.width / 2 + burstRadius * Math.cos(angle + burstAngle + burstTwist) * 0.3,
			canvas.height / 2 + burstRadius * Math.sin(angle + burstAngle + burstTwist) * 0.3,
			canvas.width / 2,
			canvas.height / 2
		);
	}
	ctx.fillStyle = prop("color2");
	ctx.fill();
	ctx.closePath();
	
	// Burst 2
	ctx.beginPath();
	for (var a = 0; a < 16; a++) {
		var angle = (a / 16) * Math.PI * 2 + burstAngle;
		
		// no twist for now
		ctx.moveTo(canvas.width / 2, canvas.height / 2);
		ctx.quadraticCurveTo(
			canvas.width / 2 + burstRadius * Math.cos(angle - burstAngle + burstTwist) * 0.3,
			canvas.height / 2 + burstRadius * Math.sin(angle - burstAngle + burstTwist) * 0.3,
			canvas.width / 2 + burstRadius * Math.cos(angle - burstAngle),
			canvas.height / 2 + burstRadius * Math.sin(angle - burstAngle)
		);
		ctx.lineTo(
			canvas.width / 2 + burstRadius * Math.cos(angle + burstAngle),
			canvas.height / 2 + burstRadius * Math.sin(angle + burstAngle)
		);
		ctx.quadraticCurveTo(
			canvas.width / 2 + burstRadius * Math.cos(angle + burstAngle + burstTwist) * 0.3,
			canvas.height / 2 + burstRadius * Math.sin(angle + burstAngle + burstTwist) * 0.3,
			canvas.width / 2,
			canvas.height / 2
		);
	}
	ctx.fillStyle = prop("color3");
	ctx.fill();
	ctx.closePath();
	
	ctx.globalAlpha = 0.9;
	// Star 1
	if (prop("starm") != "none") {
		ctx.beginPath();
		for (var a = 0; a < 16; a++) {
			var angle = (a / 16) * Math.PI * 2 + +prop("star1rot") * (Math.PI / 180);
			var r = (a % 2) ? burstRadius * 0.2 : burstRadius * 0.4
			
			var coords = [
				canvas.width / 2 + r * Math.cos(angle),
				canvas.height / 2 + r * Math.sin(angle),
			];
			if (a)
				ctx.lineTo(...coords);
			else
				ctx.moveTo(...coords);
		}
		ctx.fillStyle = prop("star");
		ctx.fill();
		ctx.closePath();
	}
	
	ctx.globalAlpha = 1;
	// Star 2
	if (prop("starm") == "both") {
		ctx.beginPath();
		for (var a = 0; a < 16; a++) {
			var angle = (a / 16) * Math.PI * 2 + +prop("star2rot") * (Math.PI / 180);
			var r = (a % 2) ? burstRadius * 0.15 : burstRadius * 0.28
			
			var coords = [
				canvas.width / 2 + r * Math.cos(angle),
				canvas.height / 2 + r * Math.sin(angle),
			];
			if (a)
				ctx.lineTo(...coords);
			else
				ctx.moveTo(...coords);
		}
		ctx.fillStyle = prop("star");
		ctx.fill();
		ctx.closePath();
	}
	
	var path = imgPath(prop("face") + prop("eyes") + (isPreview ? "_preview" : ""));
	var img = new Image();

	img.onload = function() {
		ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
		
		var scale = canvas.height / 2160;
		
		if (prop("eyes") == "e") {
			// eyes
			ctx.fillStyle = prop("eye");
			ctx.globalCompositeOperation = "hue";
			ctx.beginPath();
			ctx.arc(
				1973 * scale + 196 * scale / 2, 881*scale + 196 * scale / 2,
				196 * scale / 2,
				0, 2*Math.PI
			);
			ctx.arc(
				1620 * scale + 196 * scale / 2, 919*scale + 196 * scale / 2,
				196 * scale / 2,
				0, 2*Math.PI
			);
			ctx.fill();
			ctx.closePath();
			ctx.globalCompositeOperation = "source-over";
		}
		
		finishExporting(isPreview);
	}

	img.src = path;
}
styleRenderers.nMinimal = function(canvas, isPreview) {
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	ctx.fillStyle = prop("bg");
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	var trophyPath = new Path2D("M119.9-256H-120c-57.4,0-104,46.6-104,104c0,54.8,42.3,99.6,96,103.7V0c0,19.6,5.5,38.4,15.5,54.4	c9.9,16.1,24.2,29.4,41.8,38.2c2.1,1,3.8,2.6,4.9,4.5c1.2,1.9,1.8,4.1,1.8,6.4V160c0,4.9-1.4,9.6-3.9,13.6s-6,7.3-10.4,9.5L-96,192	v64h192v-64l-17.7-8.8c-8.8-4.4-14.3-13.3-14.3-23.2v-56.5c0-4.6,2.6-8.9,6.8-10.9c17.5-8.8,31.8-22.1,41.8-38.2	C122.4,38.3,128,19.6,128,0v-48.3c53.7-4.1,96-49,96-103.7C223.9-209.4,177.3-256,119.9-256z M-128-80.4c-36-4-64-34.5-64-71.6	s28-67.6,64-71.6V-80.4z M127.9-80.4v-143.2c36,4,64,34.5,64,71.6S163.9-84.4,127.9-80.4z");
	
	ctx.fillStyle = "#000";
	
	var count = prop("count");
	var radius = +prop("radius") * (canvas.width / 960);
	var angle = prop("angle") * (Math.PI / 180);
	
	function blend(c1, c2, x) {
		var r1 = parseInt(c1.substr(1, 2), 16)
		var r2 = parseInt(c2.substr(1, 2), 16)
		var g1 = parseInt(c1.substr(3, 2), 16)
		var g2 = parseInt(c2.substr(3, 2), 16)
		var b1 = parseInt(c1.substr(5, 2), 16)
		var b2 = parseInt(c2.substr(5, 2), 16)
		
		var r = (r1 + x * (r2 - r1))|0;
		var g = (g1 + x * (g2 - g1))|0;
		var b = (b1 + x * (b2 - b1))|0;
		
		return "rgb(" + r + ", " + g + ", " + b + ")";
	}
	
	for (var n = 0; n < count; n++) {
		var x = (count > 1) ? (n / (count - 1)) : 0.5;
		
		ctx.resetTransform();
		
		ctx.translate(canvas.width / 2, canvas.height / 2);
		
		var _x = x + +prop("posShift");
		ctx.translate(radius * Math.cos(angle) * (_x * 2 - 1), radius * Math.sin(angle) * (_x * 2 - 1));
		
		ctx.scale(0.7, 0.7);
		ctx.scale(canvas.width / 960, canvas.width / 960);
		ctx.scale(+prop("itemScale"), +prop("itemScale"));
		
		ctx.rotate(+prop("itemRot") * (Math.PI / 180));
		
		ctx.fillStyle = blend(prop("color1"), prop("color2"), x);
		ctx.fill(trophyPath);
	}
	ctx.resetTransform();
	
	// ctx.fill(trophyPath);
	
	finishExporting(isPreview);
}
// CRYSTAL CUT
styleRenderers.crystal1 = function(canvas, isPreview) {
	var ctx = canvas.getContext("2d");

	var path = imgPath("outline"+prop("shape") + (isPreview ? "_preview" : ""));
	var img = new Image();
	
	var trophyPath = new Path2D("M119.9-256H-120c-57.4,0-104,46.6-104,104c0,54.8,42.3,99.6,96,103.7V0c0,19.6,5.5,38.4,15.5,54.4	c9.9,16.1,24.2,29.4,41.8,38.2c2.1,1,3.8,2.6,4.9,4.5c1.2,1.9,1.8,4.1,1.8,6.4V160c0,4.9-1.4,9.6-3.9,13.6s-6,7.3-10.4,9.5L-96,192	v64h192v-64l-17.7-8.8c-8.8-4.4-14.3-13.3-14.3-23.2v-56.5c0-4.6,2.6-8.9,6.8-10.9c17.5-8.8,31.8-22.1,41.8-38.2	C122.4,38.3,128,19.6,128,0v-48.3c53.7-4.1,96-49,96-103.7C223.9-209.4,177.3-256,119.9-256z M-128-80.4c-36-4-64-34.5-64-71.6	s28-67.6,64-71.6V-80.4z M127.9-80.4v-143.2c36,4,64,34.5,64,71.6S163.9-84.4,127.9-80.4z");
	
	function drawTrophy() {
		ctx.fillStyle = prop("tColor");
		ctx.translate(canvas.width / 2, canvas.height / 2);
		ctx.scale(0.5 * canvas.width / 960, 0.5 * canvas.width / 960);
		ctx.fill(trophyPath);
		ctx.resetTransform();
	}
	
	//tBlend
	
	img.onload = function() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
		
		ctx.globalCompositeOperation = "source-in";
		ctx.fillStyle = prop("color");
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.globalCompositeOperation = "destination-over";
		ctx.fillStyle = prop("bgColor");
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		if (prop("tBlend") == "multiply") {
			ctx.globalCompositeOperation = "source-over";
			drawTrophy();
		}
		
		ctx.globalCompositeOperation = "source-over";
		
		var path2 = imgPath("main"+prop("shape")+"_"+prop("style") + (isPreview ? "_preview" : ""));
		var img2 = new Image();
		
		img2.onload = function() {
			ctx.globalCompositeOperation = "multiply";
			ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
			
			if (prop("tBlend") == "solid") {
				ctx.globalCompositeOperation = "source-over";
				drawTrophy();
			} else if (prop("tBlend") == "screen") {
				ctx.globalCompositeOperation = "screen";
				drawTrophy();
			}
			
			ctx.globalCompositeOperation = "source-over";
			
			finishExporting(isPreview);
		}
		
		img2.src = path2;
		
	}

	img.src = path;
}
// STACK
styleRenderers.stack1 = function(canvas, isPreview) {
	var ctx = canvas.getContext("2d");

	var path = imgPath("main"+prop("var") + (isPreview ? "_preview" : ""));
	var img = new Image();
	//tBlend
	
	img.onload = function() {
		ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
		
		ctx.fillStyle = prop("color2");
		ctx.globalCompositeOperation = "screen";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.fillStyle = prop("color1");
		ctx.globalCompositeOperation = "multiply";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.globalCompositeOperation = "source-over";
			
		finishExporting(isPreview);
	}

	img.src = path;
}
styleRenderers.stack1glass = function(canvas, isPreview) {
	var ctx = canvas.getContext("2d");

	var path = imgPath("glass_r_o_"+prop("var") + (isPreview ? "_preview" : ""));
	var img = new Image();
	
	// Simulating light passing through multiple panes of tinted glass
	var numPanes = 16; // let's say it's 8, don't ask questions for now
	var color = prop("color");
	var r = parseInt(color.substr(1, 2), 16) / 255
	var g = parseInt(color.substr(3, 2), 16) / 255
	var b = parseInt(color.substr(5, 2), 16) / 255
	
	var color2 = "rgb(" + 
		Math.round(255 * r ** numPanes) + ", " +
		Math.round(255 * g ** numPanes) + ", " +
		Math.round(255 * b ** numPanes) + ")";
	
	
	img.onload = function() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
		
		ctx.globalCompositeOperation = "source-in";
		ctx.fillStyle = color2;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		ctx.globalCompositeOperation = "destination-over";
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		var path2 = imgPath("reflection_r_"+prop("var") + (isPreview ? "_preview" : ""));
		var img2 = new Image();
		
		img2.onload = function() {
			ctx.globalAlpha = 0.4;
			ctx.globalCompositeOperation = "screen";
			ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
			ctx.globalAlpha = 1;
		
			var path3 = imgPath("outline_r_"+prop("var") + (isPreview ? "_preview" : ""));
			var img3 = new Image();
			
			img3.onload = function() {
				ctx.globalCompositeOperation = "destination-in";
				ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
				
				ctx.fillStyle = "#fff";
				ctx.globalCompositeOperation = "destination-over";
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				
				ctx.fillStyle = prop("bgColor");
				ctx.globalCompositeOperation = "multiply";
				ctx.fillRect(0, 0, canvas.width, canvas.height);
								
				ctx.globalCompositeOperation = "source-over";
				
				finishExporting(isPreview);
			}
			
			img3.src = path3;
		}
		
		img2.src = path2;
	}

	img.src = path;
}
styleRenderers.ominous = function(canvas, isPreview) {
	var ctx = canvas.getContext("2d");

	var path = imgPath("main_"+prop("angle") + (isPreview ? "_preview" : ""));
	var img = new Image();
	
	img.onload = function() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(this, 0, 0, canvas.width, canvas.height);

		ctx.fillStyle = prop("color");
		ctx.globalCompositeOperation = "multiply";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
								
		ctx.globalCompositeOperation = "source-over";
				
		finishExporting(isPreview);
	}

	img.src = path;
}
styleRenderers.neon = function(canvas, isPreview) {
	var ctx = canvas.getContext("2d");

	var path = imgPath("main_"+prop("angle") + (isPreview ? "_preview" : ""));
	var img = new Image();
	
	img.onload = function() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(this, 0, 0, canvas.width, canvas.height);

		ctx.fillStyle = prop("color");
		ctx.globalCompositeOperation = "color-burn";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
								
		ctx.globalCompositeOperation = "source-over";
				
		finishExporting(isPreview);
	}

	img.src = path;
}
styleRenderers.cornell = function(canvas, isPreview) {
	var ctx = canvas.getContext("2d");
	
	var leftURL, rightURL;

	var path = imgPath("left" + (isPreview ? "_preview" : ""));
	var img = new Image();
	
	img.onload = function() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(this, 0, 0, canvas.width, canvas.height);

		ctx.fillStyle = prop("left");
		ctx.globalCompositeOperation = "source-in";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		ctx.globalCompositeOperation = "source-over";
		
		leftURL = canvas.toDataURL();
		
		var path2 = imgPath("right" + (isPreview ? "_preview" : ""));
		var img2 = new Image();
		
		img2.onload = function() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
			
			ctx.fillStyle = prop("right");
			ctx.globalCompositeOperation = "source-in";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			
			ctx.globalCompositeOperation = "source-over";
			
			rightURL = canvas.toDataURL();
			
			var path3 = imgPath("base" + (isPreview ? "_preview" : ""));
			var img3 = new Image();
			
			img3.onload = function() {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
				
				ctx.globalCompositeOperation = "multiply";
				ctx.fillStyle = prop("light");
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				
				var imgLeft = new Image();
				
				imgLeft.onload = function() {
					ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
					var imgRight = new Image();
				
					imgRight.onload = function() {
						ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
						
						ctx.globalCompositeOperation = "source-over";
						finishExporting(isPreview);
					}
					
					imgRight.src = rightURL;
				}
				
				imgLeft.src = leftURL;
			}
			
			img3.src = path3;
		}
		
		img2.src = path2;		
	}

	img.src = path;
}
styleRenderers.cornell_e = function(canvas, isPreview) {
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	var redURL, greenURL;	
	
	var rPath = imgPath("e_left" + (isPreview ? "_preview" : ""));
	var rImg = new Image();

	rImg.onload = function() {
		ctx.drawImage(this, 0, 0, canvas.width, canvas.height);

		ctx.fillStyle = prop("left");
		ctx.globalCompositeOperation = "multiply";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		redURL = canvas.toDataURL();

		var gPath = imgPath("e_right" + (isPreview ? "_preview" : ""));
		var gImg = new Image();

		gImg.onload = function() {
			ctx.globalCompositeOperation = "source-over";
			ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
			
			ctx.fillStyle = prop("right");
			ctx.globalCompositeOperation = "multiply";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			
			greenURL = canvas.toDataURL();
			
			bPath = imgPath("e_top" + (isPreview ? "_preview" : ""));
			var bImg = new Image();

			bImg.onload = function() {
				ctx.globalCompositeOperation = "source-over";
				ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
				
				ctx.fillStyle = prop("top");
				ctx.globalCompositeOperation = "multiply";
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				
				ctx.globalCompositeOperation = "screen";
				
				var r_Img = new Image();
				r_Img.onload = function() {
					ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
					
					var g_Img = new Image();
					g_Img.onload = function() {
						ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
						ctx.globalCompositeOperation = "source-over";
						finishExporting(isPreview);
					}
					g_Img.src = greenURL;
				}
				r_Img.src = redURL;
			}
			bImg.src = bPath;
		}
		gImg.src = gPath;
	}

	rImg.src = rPath;
}
styleRenderers.refraction = function(canvas, isPreview) {
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	var redURL, greenURL;	
	
	var path = imgPath(prop("var") + "_" + prop("theme") + (isPreview ? "_preview" : ""));
	var img = new Image();

	img.onload = function() {
		ctx.drawImage(this, 0, 0, canvas.width, canvas.height);

		ctx.fillStyle = prop("color1");
		ctx.globalCompositeOperation = "screen";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.fillStyle = prop("color2");
		ctx.globalCompositeOperation = "multiply";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.globalCompositeOperation = "source-over";
		finishExporting(isPreview);
	}

	img.src = path;
}

function prop(name) {
	return document.querySelector("article[data-style="+currentStyle+"] *[data-prop="+name+"]").value;
}

function imgPath(name) {
	return "res/" + currentStyle +"/" + name + imageExtension;
}

function imgPathSVG(name) {
	return "res/" + currentStyle +"/" + name + ".svg";
}

function renderPreview() {
	document.querySelector(".rendering").style.display = "block";
	styleRenderers[currentStyle](document.querySelector("#preview"), true);
}

function exportWallpaper() {
	var sizes = {
		"hd": [1280, 720],
		"fhd": [1920, 1080],
		"2k": [2560, 1440],
		"4k": [3860, 2160]
	};

	exportSize = sizes[document.querySelector("#exportResolution").value];

	exportCanvas.width = exportSize[0];
	exportCanvas.height = exportSize[1];

	document.querySelector(".rendering").style.display = "block";
	styleRenderers[currentStyle](exportCanvas, false);
}

function finishExporting(isPreview) {
	document.querySelector(".rendering").style.display = "none";
	
	// watermark!
	var canvas = isPreview ? document.querySelector("#preview") : exportCanvas;
	var ctx = canvas.getContext("2d");
	
	var img = new Image();
	
	img.onload = function() {
		ctx.globalCompositeOperation = "source-over";
		ctx.drawImage(this, canvas.width * 0.2, canvas.height * 0.2, canvas.width * 0.8, canvas.height * 0.8);
		
		if (!isPreview) {
			var url = exportCanvas.toDataURL("image/jpeg");
			var a = document.createElement("a");

			a.setAttribute("href", url);
			a.setAttribute("download", currentStyle + "_" + exportSize.join("x") + ".jpg");
			a.click();
		}
	}
	
	img.src = "img/watermark.png";
}

// Add change events
document.querySelectorAll("article[data-style] *[data-prop]").forEach(function(e) {
	e.addEventListener("change", function() {
		if (this.type == "color") {
			if (this.parentNode.classList.contains("colorInput")) {
				this.parentNode.style.background = this.value;
			}
		}
		
		renderPreview();
	})
});

document.querySelectorAll("input[data-prop][type=color]").forEach(function(e) {
	if (e.parentNode.classList.contains("colorInput")) {
		e.parentNode.style.background = e.value;
	}
});

// Style selector
document.querySelectorAll("div.styleSelector img").forEach(function(e) {
	e.addEventListener("click", function() {
		e.parentNode.querySelector(".selected").classList.remove("selected");
		e.classList.add("selected");

		currentStyle = e.getAttribute("data-style");
		// document.querySelector("#selectedStyle").innerText = styleNames[currentStyle];

		document.querySelector("article.selected").classList.remove("selected");
		document.querySelector("article[data-style="+currentStyle+"]").classList.add("selected");

		renderPreview();
	});
});

// Export button click event
document.querySelector("#startExporting").addEventListener("click", function() {
	exportWallpaper();
});

// Accordions! (only portrait)
document.querySelectorAll("div.accordion h1").forEach(function(h1) {
	h1.addEventListener("click", function() {
		this.parentNode.classList.toggle("expanded");
	});
});

// Canvas resizing
var isWaitingForRender = false;
var renderWaitTO = null;

function resize() {
	if (isWaitingForRender) {
		clearTimeout(renderWaitTO);
	}
	renderWaitTO = setTimeout(function() {
		isWaitingForRender = false;
		renderPreview();
	}, 1000);
	isWaitingForRender = true;
	
	var preview = document.querySelector("#preview");
	
	if (innerWidth > 768) { // Landscape / desktop
		var w = Math.min(960, innerWidth - 376 - 32);
		var h = w * (9 / 16);
		
		preview.width = w;
		preview.height = h|0;
	} else {
		var h = innerHeight - 320;
		var w = h * (16/9);
		
		preview.width = w|0;
		preview.height = h;
	}
}

// we can see!
resize();
renderPreview();
addEventListener("resize", resize);