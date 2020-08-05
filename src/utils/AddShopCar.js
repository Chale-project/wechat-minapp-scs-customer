
function bezier(potsTemp) {
  var pot;
  var lines;
  var ret = [];
  var points;
  var amount = 50;
  var needReverse = false
  //topPoint 插入
  var topPoint = {};
  if (potsTemp[1]['y'] < potsTemp[0]['y']) {
    topPoint['y'] = potsTemp[1]['y'] - 150;
  } else {
    topPoint['y'] = potsTemp[0]['y'] - 150;
  }
  topPoint['x'] = Math.abs(potsTemp[1]['x'] - potsTemp[0]['x']) / 2;

  if (potsTemp[1]['x'] > potsTemp[0]['x']) {
    topPoint['x'] = (potsTemp[1]['x'] - potsTemp[0]['x']) / 2 + potsTemp[0]['x'];
  } else {
    topPoint['x'] = (potsTemp[0]['x'] - potsTemp[1]['x']) / 2 + potsTemp[1]['x'];
    needReverse = true
  }

  var pots = new Array(potsTemp[0], topPoint, potsTemp[1])
  if (needReverse == true) {
    pots = new Array(potsTemp[1], topPoint, potsTemp[0])
  }

  if (needReverse == false) {
    for (var i = 0; i <= amount; i++) {
      points = pots.slice(0);
      lines = [];
      while (pot = points.shift()) {
        if (points.length) {
          lines.push(pointLine([pot, points[0]], i / amount));
        } else if (lines.length > 1) {
          points = lines;
          lines = [];
        } else {
          break;
        }
      }
      ret.push(lines[0]);
    }
  } else {
    for (var i = amount; i >= 0; i--) {
      points = pots.slice(0);
      lines = [];
      while (pot = points.shift()) {
        if (points.length) {
          lines.push(pointLine([pot, points[0]], i / amount));
        } else if (lines.length > 1) {
          points = lines;
          lines = [];
        } else {
          break;
        }
      }
      ret.push(lines[0]);
    }
  }

  function pointLine(points, rate) {
    var pointA, pointB, pointDistance, xDistance, yDistance, tan, radian, tmpPointDistance;
    var ret = [];
    pointA = points[0];//点击
    pointB = points[1];//中间
    xDistance = pointB.x - pointA.x;
    yDistance = pointB.y - pointA.y;
    pointDistance = Math.pow(Math.pow(xDistance, 2) + Math.pow(yDistance, 2), 1 / 2);
    tan = yDistance / xDistance;
    radian = Math.atan(tan);
    tmpPointDistance = pointDistance * rate;
    ret = {
      x: pointA.x + tmpPointDistance * Math.cos(radian),
      y: pointA.y + tmpPointDistance * Math.sin(radian)
    };
    return ret;
  }
  return {
    'bezier_points': ret
  };
}

function startAddShopAnimation(potsTemp, nowThis) {

  nowThis.displayGoodBox = true
  let that1 = nowThis
  var linePos = bezier(potsTemp)
  var bezier_points = linePos['bezier_points'];
  let index = bezier_points.length
  var timeInt = setInterval(function () {
    index--
    var context = wx.createContext()
    context.fillStyle = "#FF0000";
    let x = bezier_points[index]['x'] / 750 * wx.getSystemInfoSync().windowWidth;
    let y = bezier_points[index]['y'] / 750 * wx.getSystemInfoSync().windowWidth;
    context.arc(x, y, 10, 0, Math.PI * 2, true);
    context.fill()
    wx.drawCanvas({
      canvasId: "myCanvas",
      actions: context.getActions()
    })

    if (index <= 0) {
      clearInterval(timeInt)
      context.clearRect(x - 10, y - 10, 100, 100);
      wx.drawCanvas({
        canvasId: "myCanvas",
        actions: context.getActions()
      })
      that1.displayGoodBox = false

    }
  }, 10)
}



module.exports = {
  startAddShopAnimation: startAddShopAnimation
}