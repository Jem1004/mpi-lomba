/**
 * Quiz Debug and Testing Script
 * For testing Enhanced Quiz System functionality
 * Author: MPI Development Team
 */

class QuizDebugger {
    constructor() {
        this.testResults = [];
        this.currentTest = null;
    }

    /**
     * Run comprehensive quiz system tests
     */
    async runAllTests() {
        console.log('🧪 Starting Quiz System Tests...');

        this.testResults = [];

        // Test 1: Check if Enhanced Quiz System is loaded
        this.testEnhancedQuizSystemLoaded();

        // Test 2: Check if MPI App is available
        this.testMPIAppAvailable();

        // Test 3: Check quiz questions data
        this.testQuizQuestionsData();

        // Test 4: Test quiz initialization
        this.testQuizInitialization();

        // Test 5: Test UI elements
        this.testUIElements();

        // Test 6: Test navigation functionality
        this.testNavigationFunctionality();

        // Generate report
        this.generateTestReport();

        return this.testResults;
    }

    /**
     * Test 1: Enhanced Quiz System Loaded
     */
    testEnhancedQuizSystemLoaded() {
        const testName = 'Enhanced Quiz System Loaded';
        const result = {
            name: testName,
            passed: false,
            message: '',
            details: {}
        };

        try {
            if (typeof EnhancedQuizSystem !== 'undefined') {
                result.passed = true;
                result.message = '✅ Enhanced Quiz System is loaded';
                result.details.classAvailable = true;
            } else {
                result.message = '❌ Enhanced Quiz System is not loaded';
                result.details.classAvailable = false;
            }
        } catch (error) {
            result.message = `❌ Error checking Enhanced Quiz System: ${error.message}`;
            result.details.error = error.message;
        }

        this.testResults.push(result);
        console.log(`Test ${this.testResults.length}: ${result.message}`);
        return result;
    }

    /**
     * Test 2: MPI App Available
     */
    testMPIAppAvailable() {
        const testName = 'MPI App Available';
        const result = {
            name: testName,
            passed: false,
            message: '',
            details: {}
        };

        try {
            if (window.mpiApp) {
                result.passed = true;
                result.message = '✅ MPI App is available';
                result.details.appAvailable = true;
                result.details.appType = typeof window.mpiApp;
            } else {
                result.message = '❌ MPI App is not available';
                result.details.appAvailable = false;
            }
        } catch (error) {
            result.message = `❌ Error checking MPI App: ${error.message}`;
            result.details.error = error.message;
        }

        this.testResults.push(result);
        console.log(`Test ${this.testResults.length}: ${result.message}`);
        return result;
    }

    /**
     * Test 3: Quiz Questions Data
     */
    testQuizQuestionsData() {
        const testName = 'Quiz Questions Data';
        const result = {
            name: testName,
            passed: false,
            message: '',
            details: {}
        };

        try {
            // Check appData
            if (window.appData) {
                result.details.appDataAvailable = true;
                result.details.quizDataAvailable = !!window.appData.quiz_akhir;
                result.details.quizCount = window.appData.quiz_akhir ? window.appData.quiz_akhir.length : 0;

                if (window.appData.quiz_akhir && window.appData.quiz_akhir.length > 0) {
                    result.passed = true;
                    result.message = `✅ Quiz data available (${window.appData.quiz_akhir.length} questions)`;
                } else {
                    result.message = '⚠️ Quiz data empty or not available';
                }
            } else {
                result.details.appDataAvailable = false;
                result.message = '⚠️ window.appData not available';
            }

            // Check fallback data
            if (window.mpiApp && window.mpiApp.getQuizQuestions) {
                const fallbackQuestions = window.mpiApp.getQuizQuestions();
                result.details.fallbackQuestions = fallbackQuestions.length;

                if (fallbackQuestions.length > 0) {
                    result.passed = true;
                    result.message += ` ✅ Fallback questions available (${fallbackQuestions.length} questions)`;
                }
            }

        } catch (error) {
            result.message = `❌ Error checking quiz data: ${error.message}`;
            result.details.error = error.message;
        }

        this.testResults.push(result);
        console.log(`Test ${this.testResults.length}: ${result.message}`);
        return result;
    }

    /**
     * Test 4: Quiz Initialization
     */
    testQuizInitialization() {
        const testName = 'Quiz Initialization';
        const result = {
            name: testName,
            passed: false,
            message: '',
            details: {}
        };

        try {
            if (window.mpiApp && window.mpiApp.enhancedQuizSystem) {
                result.details.enhancedQuizAvailable = true;
                result.details.quizSystemType = 'Enhanced';

                // Test initialization
                const questions = window.mpiApp.getQuizQuestions();
                if (questions.length > 0) {
                    window.mpiApp.enhancedQuizSystem.initializeQuiz(questions, {
                        allowBackNavigation: true,
                        showImmediateFeedback: false,
                        passingScore: 70,
                        shuffleQuestions: false,
                        shuffleAnswers: false
                    });

                    result.passed = true;
                    result.message = '✅ Enhanced Quiz System initialized successfully';
                    result.details.questionsInitialized = questions.length;
                } else {
                    result.message = '❌ No questions available for initialization';
                }
            } else {
                result.details.enhancedQuizAvailable = false;
                result.message = '⚠️ Enhanced Quiz System not available, will use fallback';

                // Test original quiz system
                if (window.mpiApp && window.mpiApp.initializeOriginalQuiz) {
                    result.details.originalQuizAvailable = true;
                    result.message = '⚠️ Will use original quiz system';
                } else {
                    result.message = '❌ No quiz system available';
                }
            }
        } catch (error) {
            result.message = `❌ Error testing quiz initialization: ${error.message}`;
            result.details.error = error.message;
        }

        this.testResults.push(result);
        console.log(`Test ${this.testResults.length}: ${result.message}`);
        return result;
    }

    /**
     * Test 5: UI Elements
     */
    testUIElements() {
        const testName = 'UI Elements';
        const result = {
            name: testName,
            passed: false,
            message: '',
            details: {}
        };

        try {
            const requiredElements = [
                'contentPages',
                'questionContainer',
                'btnPrevQuestion',
                'btnNextQuestion',
                'btnSubmitQuiz',
                'questionIndicators',
                'quizProgressFill',
                'quizProgressText'
            ];

            const foundElements = [];
            const missingElements = [];

            requiredElements.forEach(elementId => {
                const element = document.getElementById(elementId);
                if (element) {
                    foundElements.push(elementId);
                } else {
                    missingElements.push(elementId);
                }
            });

            result.details.foundElements = foundElements;
            result.details.missingElements = missingElements;
            result.details.totalElements = requiredElements.length;
            result.details.foundCount = foundElements.length;

            if (foundElements.length >= requiredElements.length * 0.8) {
                result.passed = true;
                result.message = `✅ UI elements available (${foundElements.length}/${requiredElements.length})`;
            } else {
                result.message = `⚠️ Some UI elements missing (${foundElements.length}/${requiredElements.length})`;
            }
        } catch (error) {
            result.message = `❌ Error testing UI elements: ${error.message}`;
            result.details.error = error.message;
        }

        this.testResults.push(result);
        console.log(`Test ${this.testResults.length}: ${result.message}`);
        return result;
    }

    /**
     * Test 6: Navigation Functionality
     */
    testNavigationFunctionality() {
        const testName = 'Navigation Functionality';
        const result = {
            name: testName,
            passed: false,
            message: '',
            details: {}
        };

        try {
            if (window.enhancedQuizSystem) {
                result.details.enhancedQuizSystem = true;

                // Test navigation methods
                const navigationMethods = [
                    'previousQuestion',
                    'nextQuestion',
                    'goToQuestion',
                    'selectAnswer',
                    'updateNavigation'
                ];

                const availableMethods = [];
                const missingMethods = [];

                navigationMethods.forEach(method => {
                    if (typeof window.enhancedQuizSystem[method] === 'function') {
                        availableMethods.push(method);
                    } else {
                        missingMethods.push(method);
                    }
                });

                result.details.availableMethods = availableMethods;
                result.details.missingMethods = missingMethods;

                if (availableMethods.length === navigationMethods.length) {
                    result.passed = true;
                    result.message = '✅ All navigation methods available';
                } else {
                    result.message = `⚠️ Some navigation methods missing (${availableMethods.length}/${navigationMethods.length})`;
                }
            } else {
                result.details.enhancedQuizSystem = false;
                result.message = '⚠️ Enhanced Quiz System not available for navigation testing';
            }
        } catch (error) {
            result.message = `❌ Error testing navigation functionality: ${error.message}`;
            result.details.error = error.message;
        }

        this.testResults.push(result);
        console.log(`Test ${this.testResults.length}: ${result.message}`);
        return result;
    }

    /**
     * Generate test report
     */
    generateTestReport() {
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(test => test.passed).length;
        const failedTests = totalTests - passedTests;

        console.log('\n📊 QUIZ SYSTEM TEST REPORT');
        console.log('='.repeat(50));
        console.log(`Total Tests: ${totalTests}`);
        console.log(`Passed: ${passedTests} ✅`);
        console.log(`Failed: ${failedTests} ❌`);
        console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
        console.log('='.repeat(50));

        this.testResults.forEach((test, index) => {
            const status = test.passed ? '✅' : '❌';
            console.log(`${index + 1}. ${test.name}: ${status} ${test.message}`);

            if (test.details && Object.keys(test.details).length > 0) {
                console.log(`   Details: ${JSON.stringify(test.details, null, 2)}`);
            }
        });

        console.log('='.repeat(50));

        if (passedTests === totalTests) {
            console.log('🎉 All tests passed! Quiz system is ready.');
        } else {
            console.log('⚠️ Some tests failed. Please check the issues above.');
        }

        return {
            total: totalTests,
            passed: passedTests,
            failed: failedTests,
            successRate: Math.round((passedTests / totalTests) * 100),
            results: this.testResults
        };
    }

    /**
     * Test quiz functionality interactively
     */
    async testInteractiveQuiz() {
        console.log('🎮 Starting Interactive Quiz Test...');

        try {
            // Initialize quiz if not already done
            if (!window.enhancedQuizSystem && window.mpiApp) {
                await window.mpiApp.initializeEnhancedQuiz();
            }

            if (window.enhancedQuizSystem) {
                // Test question rendering
                console.log('Testing question rendering...');
                window.enhancedQuizSystem.renderCurrentQuestion();

                // Test navigation
                console.log('Testing navigation...');

                // Test answer selection
                console.log('Testing answer selection...');
                window.enhancedQuizSystem.selectAnswer(0);

                // Test next question
                console.log('Testing next question...');
                window.enhancedQuizSystem.nextQuestion();

                console.log('✅ Interactive test completed successfully');
                return true;
            } else {
                console.log('❌ Enhanced Quiz System not available for interactive test');
                return false;
            }
        } catch (error) {
            console.error('❌ Interactive test failed:', error);
            return false;
        }
    }

    /**
     * Fix common quiz issues
     */
    fixCommonIssues() {
        console.log('🔧 Attempting to fix common quiz issues...');

        const fixes = [];

        // Fix 1: Ensure Enhanced Quiz System is loaded
        if (typeof EnhancedQuizSystem === 'undefined') {
            console.log('❌ Enhanced Quiz System not loaded - cannot fix automatically');
        } else {
            fixes.push('✅ Enhanced Quiz System is loaded');
        }

        // Fix 2: Ensure MPI App has Enhanced Quiz System
        if (window.mpiApp && !window.mpiApp.enhancedQuizSystem) {
            window.mpiApp.enhancedQuizSystem = new EnhancedQuizSystem(window.mpiApp);
            fixes.push('✅ Enhanced Quiz System attached to MPI App');
        } else if (window.mpiApp) {
            fixes.push('✅ Enhanced Quiz System already attached to MPI App');
        } else {
            console.log('❌ MPI App not available');
        }

        // Fix 3: Ensure quiz data is available
        if (!window.appData) {
            window.appData = {
                quiz_akhir: [
                    {
                        id: 'debug-1',
                        pertanyaan: 'Ini adalah soal debug untuk testing.',
                        options: ['Option A', 'Option B', 'Option C', 'Option D'],
                        jawaban_benar: 0,
                        points: 10,
                        type: 'multiple-choice'
                    }
                ]
            };
            fixes.push('✅ Debug quiz data created');
        } else if (!window.appData.quiz_akhir || window.appData.quiz_akhir.length === 0) {
            window.appData.quiz_akhir = [
                {
                    id: 'debug-1',
                    pertanyaan: 'Ini adalah soal debug untuk testing.',
                    options: ['Option A', 'Option B', 'Option C', 'Option D'],
                    jawaban_benar: 0,
                    points: 10,
                    type: 'multiple-choice'
                }
            ];
            fixes.push('✅ Debug quiz data added');
        } else {
            fixes.push('✅ Quiz data already available');
        }

        console.log('🔧 Fixes applied:');
        fixes.forEach(fix => console.log(`   ${fix}`));

        return fixes;
    }
}

// Create global debugger instance
window.quizDebugger = new QuizDebugger();

// Auto-run tests when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('🧪 Running automatic quiz system tests...');
        window.quizDebugger.runAllTests();
    }, 2000);
});

// Make it available globally
window.runQuizTests = () => window.quizDebugger.runAllTests();
window.runInteractiveQuizTest = () => window.quizDebugger.testInteractiveQuiz();
window.fixQuizIssues = () => window.quizDebugger.fixCommonIssues();