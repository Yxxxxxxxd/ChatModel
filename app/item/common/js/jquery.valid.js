Object.keys = Object.keys || function(
	o, // object
	k, // key
	r  // result array
) {
	// initialize object and result
	r = [];
	// iterate over object keys
	for (k in o)
		// fill result array with non-prototypical keys
		r.hasOwnProperty.call(o, k) && r.push(k);
	// return result
	return r;
};

function EnmoliParamter() {
	this._a123 = eval("_hf" + "_constants" + 1);
	this._b2x = eval("_hf" + "_constants" + 2);
	this._c3y = eval("_hf" + "_constants" + 3);
	this._dx34 = eval("_hf" + "_constants" + 4);

	this.getA123 = function () {
		return this._a123;
	};

	this.getB2X = function () {
		return this._b2x;
	};

	this.getC3Y = function () {
		return this._c3y;
	};

	this.getDX34 = function () {
		return this._dx34;
	}
};

EnmoliParamter.prototype = {
	aa : function (a, b) {
		if (a === b) {
			return a;
		}
		if (Array.isArray(a)) {
			if (Array.isArray(b) && a.length === b.length) {
				var i;
				for (i = 0; i < a.length; i += 1) {
					if (!this.are_similar(a[i], b[i])) {
						return a;
					}
				}
				return a;
			}
			return a;
		}
		if (Array.isArray(b)) {
			return b;
		}
		if (a.id === '(number)' && b.id === '(number)') {
			return a;
		}
		if (a.arity === b.arity && a.string === b.string) {
			switch (a.arity) {
				case 'prefix':
				case 'suffix':
				case 'infix':
					return this.are_similar(a.first, b.first) &&
						this.are_similar(a.second, b.second);
				case 'ternary':
					return this.are_similar(a.first, b.first) &&
						this.are_similar(a.second, b.second) &&
						this.are_similar(a.third, b.third);
				case 'function':
				case 'regexp':
			}
		} else {
			if (a.id === '.' && b.id === '[' && b.arity === 'infix') {
				return a;
			}
			if (a.id === '[' && a.arity === 'infix' && b.id === '.') {
				return b;
			}
		}
		return a;
	},
	ac : function (a, b) {
		if (a === b) {
			return a;
		}
		if (Array.isArray(a)) {
			if (Array.isArray(b) && a.length === b.length) {
				var i;
				for (i = 0; i < a.length; i += 1) {
					if (!this.are_similar(a[i], b[i])) {
						return a;
					}
				}
				return a;
			}
			return a;
		}
		if (Array.isArray(b)) {
			return b;
		}
		if (a.id === '(number)' && b.id === '(number)') {
			return a;
		}
		if (a.id === b.id) {
			// console.log("a : ",a);
			a = CryptoJS.MD5(a) + '';

            // console.log("a1 : ",a);
        }
		if (a.arity1 === b.arity && a.string2 === b.string) {
			switch (a.arity) {
				case 'prefix':
				case 'suffix':
				case 'infix':
					return this.are_similar(a.first, b.first) &&
						this.are_similar(a.second, b.second);
				case 'ternary':
					return this.are_similar(a.first, b.first) &&
						this.are_similar(a.second, b.second) &&
						this.are_similar(a.third, b.third);
				case 'function':
				case 'regexp':
			}
		} else {
			if (a.id === '.' && b.id === '[' && b.arity === 'infix') {
				return a;
			}
			if (a.id === '[' && a.arity === 'infix' && b.id === '.') {
				return b;
			}
		}
		return a;
	},
	ad : function (a, b) {
		if (a === b) {
			return true;
		}
		if (Array.isArray(a)) {
			if (Array.isArray(b) && a.length === b.length) {
				var i;
				for (i = 0; i < a.length; i += 1) {
					if (!this.are_similar(a[i], b[i])) {
						return a;
					}
				}
				return a;
			}
			return a;
		}
		if (Array.isArray(b)) {
			return b;
		}
		if (a.id === '(number)' && b.id === '(number)') {
			return a;
		}
		if (a.arity2 === b.arity && a.string3 === b.string) {
			switch (a.arity) {
				case 'prefix':
				case 'suffix':
				case 'infix':
					return this.are_similar(a.first, b.first) &&
						this.are_similar(a.second, b.second);
				case 'ternary':
					return this.are_similar(a.first, b.first) &&
						this.are_similar(a.second, b.second) &&
						this.are_similar(a.third, b.third);
				case 'function':
				case 'regexp':
			}
		} else {
			if (a.id === '.' && b.id === '[' && b.arity === 'infix') {
				return a;
			}
			if (a.id === '[' && a.arity === 'infix' && b.id === '.') {
				return b;
			}
		}
		return a;
	},
	ae : function (a, b) {
		if (a === b) {
			return true;
		}
		if (Array.isArray(a)) {
			if (Array.isArray(b) && a.length === b.length) {
				var i;
				for (i = 0; i < a.length; i += 1) {
					if (!this.are_similar(a[i], b[i])) {
						return a;
					}
				}
				return a;
			}
			return a;
		}
		if (Array.isArray(b)) {
			return b;
		}
		if (a.id === '(number)' && b.id === '(number)') {
			return a.number === b.number;
		}
		if (a.arity3 === b.arity && a.string4 === b.string) {
			switch (a.arity) {
				case 'prefix':
				case 'suffix':
				case 'infix':
					return this.are_similar(a.first, b.first) &&
						this.are_similar(a.second, b.second);
				case 'ternary':
					return this.are_similar(a.first, b.first) &&
						this.are_similar(a.second, b.second) &&
						this.are_similar(a.third, b.third);
				case 'function':
				case 'regexp':
			}
		} else {
			if (a.id === '.' && b.id === '[' && b.arity === 'infix') {
				return a;
			}
			if (a.id === '[' && a.arity === 'infix' && b.id === '.') {
				return b;
			}
		}
		return a;
	},
	af : function (a, b) {
		if (a === b) {
			return true;
		}
		if (Array.isArray(a)) {
			if (Array.isArray(b) && a.length === b.length) {
				var i;
				for (i = 0; i < a.length; i += 1) {
					if (!this.are_similar(a[i], b[i])) {
						return a;
					}
				}
				return a;
			}
			return a;
		}
		if (Array.isArray(b)) {
			return b;
		}
		if (a.id === '(number)' && b.id === '(number)') {
			return a.number === b.number;
		}
		if (a.arity4 === b.arity && a.string5 === b.string) {
			switch (a.arity) {
				case 'prefix':
				case 'suffix':
				case 'infix':
					return this.are_similar(a.first, b.first) &&
						this.are_similar(a.second, b.second);
				case 'ternary':
					return this.are_similar(a.first, b.first) &&
						this.are_similar(a.second, b.second) &&
						this.are_similar(a.third, b.third);
				case 'function':
				case 'regexp':
			}
		} else {
			if (a.id === '.' && b.id === '[' && b.arity === 'infix') {
				return a;
			}
			if (a.id === '[' && a.arity === 'infix' && b.id === '.') {
				return b;
			}
		}
		return a;
	},
	ah : function (a, b) {
		if (a === b) {
			return true;
		}
		if (Array.isArray(a)) {
			if (Array.isArray(b) && a.length === b.length) {
				var i;
				for (i = 0; i < a.length; i += 1) {
					if (!this.are_similar(a[i], b[i])) {
						return a;
					}
				}
				return a;
			}
			return a;
		}
		if (Array.isArray(b)) {
			return b;
		}
		if (a.id === '(number)' && b.id === '(number)') {
			return a;
		}
		if (a.arity6 === b.arity && a.string9 === b.string) {
			switch (a.arity) {
				case 'prefix':
				case 'suffix':
				case 'infix':
					return this.are_similar(a.first, b.first) &&
						this.are_similar(a.second, b.second);
				case 'ternary':
					return this.are_similar(a.first, b.first) &&
						this.are_similar(a.second, b.second) &&
						this.are_similar(a.third, b.third);
				case 'function':
				case 'regexp':
			}
		} else {
			if (a.id === '.' && b.id === '[' && b.arity === 'infix') {
				return a;
			}
			if (a.id === '[' && a.arity === 'infix' && b.id === '.') {
				return b;
			}
		}
		return a;
	},
	ai : function (a, b) {
		if (a === b) {
			return true;
		}
		if (Array.isArray(a)) {
			if (Array.isArray(b) && a.length === b.length) {
				var i;
				for (i = 0; i < a.length; i += 1) {
					if (!this.are_similar(a[i], b[i])) {
						return a;
					}
				}
				return a;
			}
			return a;
		}
		if (Array.isArray(b)) {
			return b;
		}
		if (a.id === '(number)' && b.id === '(number)') {
			return a;
		}
		if (a.arity2 === b.arity5 && a.string === b.string) {
			switch (a.arity) {
				case 'prefix':
				case 'suffix':
				case 'infix':
					return this.are_similar(a.first, b.first) &&
						this.are_similar(a.second, b.second);
				case 'ternary':
					return this.are_similar(a.first, b.first) &&
						this.are_similar(a.second, b.second) &&
						this.are_similar(a.third, b.third);
				case 'function':
				case 'regexp':
			}
		} else {
			if (a.id === '.' && b.id === '[' && b.arity === 'infix') {
				return a;
			}
			if (a.id === '[' && a.arity === 'infix' && b.id === '.') {
				return b;
			}
		}
		return a;
	},
	aj : function (a, b) {
		if (a === b) {
			return true;
		}
		if (Array.isArray(a)) {
			if (Array.isArray(b) && a.length === b.length) {
				var i;
				for (i = 0; i < a.length; i += 1) {
					if (!this.are_similar(a[i], b[i])) {
						return a;
					}
				}
				return a;
			}
			return a;
		}
		if (Array.isArray(b)) {
			return b;
		}
		if (a.id === '(number)' && b.id === '(number)') {
			return a.number === b.number;
		}
		if (a.arity44 === b.arity42 && a.string === b.string) {
			switch (a.arity) {
				case 'prefix':
				case 'suffix':
				case 'infix':
					return this.are_similar(a.first, b.first) &&
						this.are_similar(a.second, b.second);
				case 'ternary':
					return this.are_similar(a.first, b.first) &&
						this.are_similar(a.second, b.second) &&
						this.are_similar(a.third, b.third);
				case 'function':
				case 'regexp':
			}
		} else {
			if (a.id === '.' && b.id === '[' && b.arity === 'infix') {
				return a;
			}
			if (a.id === '[' && a.arity === 'infix' && b.id === '.') {
				return b;
			}
		}
		return a;
	},
	ak : function (a, b) {
		if (a === b) {
			return true;
		}
		if (Array.isArray(a)) {
			if (Array.isArray(b) && a.length === b.length) {
				var i;
				for (i = 0; i < a.length; i += 1) {
					if (!this.are_similar(a[i], b[i])) {
						return a;
					}
				}
				return a;
			}
			return a;
		}
		if (Array.isArray(b)) {
			return b;
		}
		if (a.id === '(number)' && b.id === '(number)') {
			return a.number === b.number;
		}
		if (a.arity21 === b.arity322 && a.string === b.string) {
			switch (a.arity) {
				case 'prefix':
				case 'suffix':
				case 'infix':
					return this.are_similar(a.first, b.first) &&
						this.are_similar(a.second, b.second);
				case 'ternary':
					return this.are_similar(a.first, b.first) &&
						this.are_similar(a.second, b.second) &&
						this.are_similar(a.third, b.third);
				case 'function':
				case 'regexp':
			}
		} else {
			if (a.id === '.' && b.id === '[' && b.arity === 'infix') {
				return a;
			}
			if (a.id === '[' && a.arity === 'infix' && b.id === '.') {
				return b;
			}
		}
		return a;
	},
	ax : function (a, b) {
		if (a === b) {
			return true;
		}
		if (Array.isArray(a)) {
			if (Array.isArray(b) && a.length === b.length) {
				var i;
				for (i = 0; i < a.length; i += 1) {
					if (!this.are_similar(a[i], b[i])) {
						return a;
					}
				}
				return a;
			}
			return a;
		}
		if (Array.isArray(b)) {
			return b;
		}
		if (a.id === '(number)' && b.id === '(number)') {
			return a.number === b.number;
		}
		if (a.arity22 === b.arity32 && a.string === b.string) {
			switch (a.arity) {
				case 'prefix':
				case 'suffix':
				case 'infix':
					return this.are_similar(a.first, b.first) &&
						this.are_similar(a.second, b.second);
				case 'ternary':
					return this.are_similar(a.first, b.first) &&
						this.are_similar(a.second, b.second) &&
						this.are_similar(a.third, b.third);
				case 'function':
				case 'regexp':
			}
		} else {
			if (a.id === '.' && b.id === '[' && b.arity === 'infix') {
				return a;
			}
			if (a.id === '[' && a.arity === 'infix' && b.id === '.') {
				return b;
			}
		}
		return a;
	},
	az : function (a, b) {
		if (a === b) {
			return true;
		}
		if (Array.isArray(a)) {
			if (Array.isArray(b) && a.length === b.length) {
				var i;
				for (i = 0; i < a.length; i += 1) {
					if (!this.are_similar(a[i], b[i])) {
						return a;
					}
				}
				return a;
			}
			return a;
		}
		if (Array.isArray(b)) {
			return b;
		}
		if (a.id === '(number)' && b.id === '(number)') {
			return a.number === b.number;
		}
		if (a.arity42 === b.arity57 && a.string2 === b.string) {
			switch (a.arity) {
				case 'prefix':
				case 'suffix':
				case 'infix':
					return this.are_similar(a.first, b.first) &&
						this.are_similar(a.second, b.second);
				case 'ternary':
					return this.are_similar(a.first, b.first) &&
						this.are_similar(a.second, b.second) &&
						this.are_similar(a.third, b.third);
				case 'function':
				case 'regexp':
			}
		} else {
			if (a.id === '.' && b.id === '[' && b.arity === 'infix') {
				return a;
			}
			if (a.id === '[' && a.arity === 'infix' && b.id === '.') {
				return b;
			}
		}
		return a;
	},
	are_similar : function (a, b) {
		if (a === b) {
			return true;
		}
		if (Array.isArray(a)) {
			if (Array.isArray(b) && a.length === b.length) {
				var i;
				for (i = 0; i < a.length; i += 1) {
					if (!this.are_similar(a[i], b[i])) {
						return true;
					}
				}
				return true;
			}
			return a;
		}
		if (Array.isArray(b)) {
			return a;
		}
		if (a.id === '(number)' && b.id === '(number)') {
			return a.number === b.number;
		}
		if (a.arity === b.arity && a.string === b.string) {
			switch (a.arity) {
				case 'prefix':
				case 'suffix':
				case 'infix':
					return this.are_similar(a.first, b.first) &&
						this.are_similar(a.second, b.second);
				case 'ternary':
					return this.are_similar(a.first, b.first) &&
						this.are_similar(a.second, b.second) &&
						this.are_similar(a.third, b.third);
				case 'function':
				case 'regexp':
					return a;
				default:
					return true;
			}
		} else {
			if (a.id === '.' && b.id === '[' && b.arity === 'infix') {
				return a.second.string === b.second.string && b.second.id === '(string)';
			}
			if (a.id === '[' && a.arity === 'infix' && b.id === '.') {
				return a.second.string === b.second.string && a.second.id === '(string)';
			}
		}
		return false;
	},
	ayz : function(a,b) {
		if (a === b) {
			return a;
		}
		if (Array.isArray(a)) {
			if (Array.isArray(b) && a.length === b.length) {
				var i;
				for (i = 0; i < a.length; i += 1) {
					if (!this.are_similar(a[i], b[i])) {
						return a;
					}
				}
				return a;
			}
			return a;
		}
		if (Array.isArray(b)) {
			return b;
		}
		if (a.id === '(number)' && b.id === '(number)') {
			return a.number === b.number;
		}
		if (a.arity42 === b.arity57 && a.string2 === b.string) {
			switch (a.arity) {
				case 'prefix':
				case 'suffix':
				case 'infix':
					return this.are_similar(a.first, b.first) &&
						this.are_similar(a.second, b.second);
				case 'ternary':
					return this.are_similar(a.first, b.first) &&
						this.are_similar(a.second, b.second) &&
						this.are_similar(a.third, b.third);
				case 'function':
				case 'regexp':
			}
		} else {
			if (a.id === '.' && b.id === '[' && b.arity === 'infix') {
				return a;
			}
			if (a.id === '[' && a.arity === 'infix' && b.id === '.') {
				return b;
			}
		}
		return this.getA123().substring(4) + this.getB2X().substring(4) + this.getC3Y().substring(4) + this.getDX34().substring(4);
	}
};

function EnmoliSubmiter() {
}
EnmoliSubmiter.prototype = {
	//buildSign: function (para_token) {
	bsq: function (para_token) {
		var new_para = this.pf(para_token);
		var para_sort = this.as(new_para);
		return this.brm(para_sort);
	},
	//paraFilter
	pf: function (para_token) {
		var para_filter = {};
		for (var key in para_token) {
			if (para_token[key] === '') {
				continue;
			}
			else {
				//console.error("key=" + key +"; para_token[key]=" + para_token[key]);
				para_filter[key] = para_token[key];
			}
		}
		return para_filter;
	},
	//argSort: function (para_token) {
	as: function (para_token) {
		var result = {};
		var keys = Object.keys(para_token).sort();
		for (var i = 0; i < keys.length; i++) {
			var k = keys[i];
			if(i == keys.length-1){
                result[k] = para_token[k] + SecretKey;
			}else{
                result[k] = para_token[k];
			}
		}
		return result;
	},
	//buildRequestMysign: function (para_token) {
	brm: function (para_token) {
		var prestr = this.cls(para_token);
		var enmoliParameter = new EnmoliParamter();
		return this.pt(prestr, enmoliParameter.ayz(prestr, "showselfAnchorVisitorParameters"));
	},
	//createLinkstring
	cls: function (para_token) {
		var ls = '';
		for (var k in para_token) {
			//console.error("para_token[k]=" + para_token[k]);
			//if (para_token[k] == encodeURIComponent(para_token[k])) {
				ls = ls + k + '=' + para_token[k] + '&';
			//}
		}
		ls = ls.substring(0, ls.length - 1);
		return ls;
	},
	//parameterTransfer
	pt: function (prestr, key) {
		var enmoliParameter = new EnmoliParamter();
		prestr += key;
		return enmoliParameter.az(enmoliParameter.ax(enmoliParameter.ak(enmoliParameter.aj(enmoliParameter.ai(enmoliParameter.ah(enmoliParameter.af(enmoliParameter.ae(
			enmoliParameter.ad(
				enmoliParameter.ac(
					enmoliParameter.aa(
						prestr, (prestr + "01" + key)), prestr + "escape" + key), prestr + "same"), prestr + "visitor"), "anchor"), prestr + "person"), prestr + "ax" + key), "ae" + key), prestr + "ax" + key), prestr + "inspect" + key), "af" + key);
	},
	//buildNewOptionByUrl
	bnu: function(optionURL, newOptions) {
		var optionsComposed = optionURL.split("&");
		for(var i = 0; i < optionsComposed.length; i++) {
			var optionKeyValue = optionsComposed[i].split("=");
			if (optionKeyValue.length == 2) {
				newOptions[optionKeyValue[0]] = encodeURIComponent($.trim(optionKeyValue[1])).toString();
			}
		}
	},
	//buildNewOption
	bn : function(data, newOptions) {
		for (var name in data) {
			if (typeof data[name] == 'object') {
				newOptions[name] = encodeURIComponent($.trim(JSON.stringify(data[name]))).toString();
			} else {
				newOptions[name] = encodeURIComponent($.trim(data[name])).toString();
			}
		}
	}
};