/*
    JAVASCRIPT
        - callback functions
        - anonymous function
            - old syntax
                function(){}
            - arrow syntax
                ()=>{}
        - destructuring
        - modules
            - CommonJS modules
            - ES (EcmaScript) modules
    REACT
        - jsx
        - react components
            - should start with a capital letter
            - be exported as a default
            - return jsx
                export default Component() {
                    return (
                        <></>
                    )
                }
        - hooks
                - functions that start with the word "use" that can only be called inside of a react component at the top level
                    - useState
                    - useEffect
                    - useRef
        - props
                - data passed from one component to its child component
        - routing
                - react-router-dom
                    BrowserRouter, Link, Routes, Route
        - state managment libraries
                - jotai (my favorite, easy to use)
                - redux
                - zustand
*/

const nums = [1, 3, 4, 66, 83, 53]

function logDouble(n) {
    console.log(n*2)
}

// pre-defined function
nums.forEach(logDouble)

// old syntax
nums.forEach(function(n){
    console.log(n*2)
})

// arrow syntax
nums.forEach((n) => {
    console.log(n*2)
})

// shortened arrow syntax
nums.forEach(n => console.log(n*2))

// array destructuring
//   variable name can be whatever you want, but must come in the same order as the array
const [number1, n2, banana] = nums

const lesson = {
    teacher: 'doug',
    student: 'tural',
    subject: 'javascript'
}

// object destructuring
//  variable name must match key, any order you want
const {subject} = lesson