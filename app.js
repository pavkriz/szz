angular.module('cz.uhk.szz.results', ['ui.bootstrap', 'ngCookies']);

angular.module('cz.uhk.szz.results').controller('ResultCalculatorCtrl', function ($cookies) {
  var self = this;

  self.grades = [];
   
  self.gradeNum2Alpha = {
    1.0: 'A',   
    1.5: 'B',   
    2.0: 'C',   
    2.5: 'D',   
    3.0: 'E',   
    4.0: 'F'   
  }
  
  self.getPrimaryGrade = function(num) {
    if (self.numericButtons) {
      return num;
    } else {
      return self.gradeNum2Alpha[num];
    }
  };

 self.getSecondaryGrade = function(num) {
    if (self.numericButtons) {
      return self.gradeNum2Alpha[num];
    } else {
      return num;
    }
  };  

  self.addGrade = function() {
    self.grades.push({num:0});
    $cookies.put('numberOfGrades', self.grades.length);
  };

  self.removeGrade = function() {
    if (self.grades.length > 1) {
      self.grades.pop();
      $cookies.put('numberOfGrades', self.grades.length);
    }
  };
  
  self.avg = function() {
    var sum = 0;
    var ok = true;
    angular.forEach(self.grades, function(grade) {
      if (grade.num > 0) {
        sum += grade.num;
      } else {
        ok = false;
      }
    });
    if (ok) {
      return sum/self.grades.length;
    } else {
      return null;
    }
  };
  
  self.worst = function() {
    var max = null;
    var ok = true;
    angular.forEach(self.grades, function(grade) {
      if (grade.num > 0) {
        if (grade.num > max || max === null) {
          max = grade.num;
        }
      } else {
        ok = false;
      }
    });
    if (ok) {
      return max;
    } else {
      return null;
    }
  };
  
  self.result = function() {
    var defence = self.grades[self.grades.length - 1].num;
    var avg = self.avg();
    var worst = self.worst();
    if (avg === null || worst === null) return null; 
    // Studijní a zkušební řád UHK od 1. 9. 2015.
    // Klasifikaci, přičemž celkové hodnocení státní závěrečné zkoušky je:
    if (avg <= 1.25 && defence == 1 && worst <= 1.5) {
      // a) „A“, jestliže ze všech částí státní závěrečné zkoušky je aritmetický průměr do 1,25 včetně a diplomová nebo bakalářská práce je hodnocena stupněm „A“ a žádná další část státní závěrečné zkoušky nebyla hodnocena nižším stupněm než „B“,
      return 1;    
    } else if (avg <= 1.5 && defence <= 1.5 && worst <= 2) { 
      // b) „B“, jestliže ze všech částí státní závěrečné zkoušky je aritmetický průměr do 1,5 včetně a diplomová nebo bakalářská práce je hodnocena stupněm „A“ nebo „B“, a žádná další část státní závěrečné zkoušky nebyla hodnocena nižším stupněm než „C“,
      return 1.5;    
    } else if (avg <= 2 && defence <= 2 && worst < 4) { 
      // c) „C“, jestliže ze všech částí státní závěrečné zkoušky je aritmetický průměr do 2,0 včetně a diplomová nebo bakalářská práce je hodnocena stupněm „A“ nebo „B“ nebo „C“,
      return 2; 
    } else if (avg <= 2.5 && defence <= 2.5 && worst < 4) { 
      // d) „D“, jestliže ze všech částí státní závěrečné zkoušky je aritmetický průměr do 2,5 včetně a diplomová nebo bakalářská práce je hodnocena maximálně stupněm „D“,
      return 2.5; 
    } else if (avg <= 3 && defence <= 3 && worst < 4) { 
      // e) „E“, jestliže ze všech částí státní závěrečné zkoušky je aritmetický průměr do 3,0 včetně a diplomová nebo bakalářská práce je hodnocena maximálně stupněm „E“,
      return 3;
    } else { 
      // f) „F“, jestliže student je klasifikován v některé části státní závěrečné zkoušky klasifikačním stupněm „F“.
      return 4;
    }
  };
  
  
  var numberOfGrades = $cookies.get('numberOfGrades');
  if (!numberOfGrades) numberOfGrades = 3;  
  for (var i = 0; i < numberOfGrades; i++) {
    self.addGrade();
  }
  
  self.numericButtons = ($cookies.get('numericButtons') === 'true');
  
  self.numericButtonsChanged = function() {
    $cookies.put('numericButtons', self.numericButtons);
  }
    
});