<template>
	<div class="index">
		<example :message="marge" v-on:emits="parentemits"></example>
		<div class="button" @click="goList">
			{{ msg }}
		</div>
		<input type="text" v-model="marge" />
		<p>我随着楼上的变化而变化 {{ msgR }}</p>
		<p>{{ flitersNum | money }}过滤器只支持 {{}}插值和v-bind中使用 其他更复杂的计算 建议使用computed计算属性</p>
		<el-checkbox v-model="checked">备选项</el-checkbox>
		<div class="block">
			<el-date-picker v-model="value1" type="date" placeholder="选择日期" :picker-options="pickerOptions0">
			</el-date-picker>
		</div>
	</div>
</template>

<script>
	import Example from 'components/example.vue'
	export default {
		data() {
			return { //初始化数据模型
				msg: "测试框架",
				marge: "我是父组件index中的数据 我通过 props获取到了 来自父组件的数据, 动态绑定来自父组件的数据需要使用 v-bind",
				flitersNum: 18,
				checked: true,
				value1: '',
				pickerOptions0: {
					disabledDate(time) {
						return time.getTime() < Date.now() - 8.64e7;
					}
				}
			}
		},
		created() {
			//生命周期函数  vue实例已经创建完成之后被调用
			//该函数下 可执行 默认的ajax请求 操作 data中的数据
		},
		mounted() { //生命周期函数 改函数下 可获取DOM
			//alert($(".button").attr('class'))
		},
		methods: { //所有的 交互操作 例如：click ，mouseover等 写在此对象下
			goList() {
				location.href = "indexList.html";
			},
			parentemits(data) {
				alert(data)
			}
		},
		computed: { //计算属性，当一个数据 需要计算 并实时根据data中数据不断变化时  使用。 
			//注意，只有 当data中的数据变化时 computed里的数据才会变化 并可以一直 直接像 调用 data中的数据那样调用 computed
			msgR() {
				return this.marge.split('').reverse().join('');
			}
		},
		filters: {
			money(value) {
				return "￥" + value.toFixed(2);
			}
		},
		components: { //注册组件 以便引用
			Example
		}
	}
</script>

<style>
	body {
		width: 100%;
		height: 100%;
	}
</style>