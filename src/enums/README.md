# enums

## 枚举
```
前端伪枚举
    使用方法:
        ##### enums 文件夹下
        export default const test = {
            A: 'a',
            B: 'b',
            C: 'c',
            getValue: (key) => {
                for (i in this) {
                    if (i === key) {
                        return this[i]
                    }
                }
                return ''
            }
        }
        ##### 使用的页面
        import test from '@/enums/...'

        test.getEnums('A')
        #####
```
