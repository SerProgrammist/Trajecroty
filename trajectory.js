function MainMGB(canvas) {

    // Предварительные установки

	var deg = Math.PI / 180;			// Угловой градус (degree)

	var X_max = canvas.width;
 	var Y_max = canvas.height;
	
    // Размерные параметры

    var g = 10.;    // ускорение свободного падения
var v0 = 1;
if (v0 === 1) {
	var v0 = Slider_03.value;
}

    // Расчет констант 
	
	var h = v0 * v0 / 2 / g;
	
    // Задание начальных значений параметров
	
	var al;
	var x, y;
	var v0x, v0y;

	var beta = .2 * g / v0;
	
	set_al(50);
    
	// Область построения графика
    var x_min = 0;  
    var x_max = 2 * h;
    var y_min = 0;    
    var y_max = h;      

 	var N = X_max;                 	// число точек по оси x
	var dx = x_max / N;            	// шаг по оси x
	var sx = X_max / x_max;        	// масштаб по оси x

	var sy; 							// масштаб по оси y
	var Y0;  							// положение 0 оси y в экранных координатах
	var context;  						// на context происходит рисование

    // настройка слайдеров и текстовых полей
	
    Text_01.value = Math.round(al / deg);
	Slider_01.min = 5;       	
    Slider_01.max = 89;
    Slider_01.step = 1;
    Slider_01.value = Text_01.value;     	
	
    Text_02.value = Math.round(beta / g * v0 * 100) / 100;
	Slider_02.min = 0;       	
    Slider_02.max = 1;
    Slider_02.step = 0.01;
    Slider_02.value = Text_02.value;  

  Text_03.value = Math.round(50);
	Slider_03.min = 1;       	
    Slider_03.max = 99;
    Slider_03.step = 1;
    Slider_03.value = Text_03.value;

	draw();

    // функция, запускающаяся при перемещении слайдера
    this.set_01 = function(input) { set_al(input); draw(); }  
    this.set_02 = function(input) { beta = Number(input) * g / v0; Text_02.value = Math.round(beta / g * v0 * 100) / 100; Slider_02.value = Text_02.value; draw(); } 
	this.set_03 = function (input) {
		v0 = Number(input); Text_03.value = Math.round(v0); Slider_03.value = Text_03.value; v0x = v0 * Math.cos(al);
		v0y = v0 * Math.sin(al); draw(); }

	// Функции, запускающиеся при изменении элементов управления
    this.setCheckbox_01 = function(bool) { draw(); }
	this.setCheckbox_02 = function(bool) { draw(); }		

	function set_al(value) 
	{
		al = value * deg;
		v0x = v0 * Math.cos(al);		
		v0y = v0 * Math.sin(al);
	}

	// Отображение
	
	function draw() 
	{ 
	   // Расчет параметров графики
		
		sy = Y_max / (y_max - y_min); 			// масштаб по оси y
		Y0 = Y_max + y_min * sy;  				// положение 0 оси y в экранных координатах

		context = canvas.getContext("2d");  	// на context происходит рисование
		context.clearRect(0, 0, X_max, Y_max); 	// очистить экран
        
		// Графики 

//		Graph(F0, 	checkbox_02.checked, 	'lightgrey');		
		Graph(F1, 	checkbox_02.checked, 	'grey');
		Graph(F2, 	checkbox_01.checked, 	'red');

        // Надписи
        context.fillStyle = 'black';
        context.font = "italic 20px Times";
        context.fillText("x", x_max * sx - 15, Y0 - 7);
        context.fillText("y", 5, 15);
        context.fillText("0", 10, Y0 - 3);
	}

	// Построение графика функции
	
	function Graph(F, flag, color)
	{
		if (!flag) return;
		
		context.strokeStyle = color;
		context.beginPath();
		var dt = dx / v0x;
		var t_max = x_max / v0x;
		y = 0;
		for (var t = 0; t < t_max; t += dt)
		{
			F(t);
			var X = x * sx; 
			var Y = Y0 - y * sy; 
			context.lineTo(X, Y);	
		}
		context.stroke();
	}	
	
    // Траектории
    
    // al = 45 * deg;
	function F0(t) 	
    {
		x = v0x * t;
		y = x - g / (v0 * v0) * x * x; 
    }    

    // Произвольное al
	function F1(t)
    {
		x = v0x * t;
		y = v0y * t - g * t * t / 2; 
    }    
    
	// Сопротивление, точное решение 
	function F2(t)
    {
		if (Math.abs(beta) < 1e-6) { F1(t); return;	 }
		var t1 = (1 - Math.exp(-beta * t)) / beta;
		x = v0x * t1;
		y = (v0y + g / beta) * t1 - g / beta * t; 
    }     
	    
}
