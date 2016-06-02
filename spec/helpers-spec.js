'use babel'

import { visitMessage, htmlToText } from '../lib/helpers'

describe('Helpers', function() {
  afterEach(function() {
    atom.workspace.destroyActivePaneItem()
  })

  describe('visitMessage', function() {
    it('opens the file in message', function() {
      waitsForPromise(function() {
        return visitMessage({ filePath: __filename }).then(function() {
          const textEditor = atom.workspace.getActiveTextEditor()
          expect(textEditor.getPath()).toBe(__filename)
        })
      })
    })

    it('sets the cursor position properly', function() {
      waitsForPromise(function() {
        return visitMessage({ filePath: __filename, range: [[5, 0], [5, 5]] }).then(function() {
          const textEditor = atom.workspace.getActiveTextEditor()
          const cursorPosition = textEditor.getCursorBufferPosition()
          expect(cursorPosition.row).toBe(5)
          expect(cursorPosition.column).toBe(0)
        })
      })
    })

    it('triggers the selected callback if any', function() {
      const selected = jasmine.createSpy('selected')
      const message = { filePath: __filename, selected }

      waitsForPromise(function() {
        return visitMessage(message).then(function() {
          expect(selected).toHaveBeenCalled()
          expect(selected.calls.length).toBe(1)
          expect(selected.mostRecentCall.args.length).toBe(1)
          expect(selected.mostRecentCall.args[0]).toBe(message)
        })
      })
    })
  })
  describe('htmlToText', function() {
    it('converts html to text properly', function() {
      expect(htmlToText('<button>Hey&nbsp;Man</button> What\'s Up?')).toBe('Hey Man What\'s Up?')
    })
    it('also accepts html elements', function() {
      const element = document.createElement('div')
      element.innerHTML = '<button>Hey&nbsp;Man</button> What\'s Up?'
      expect(htmlToText(element)).toBe('Hey Man What\'s Up?')
    })
  })
})
