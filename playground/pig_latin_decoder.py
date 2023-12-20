import re
from flask import Blueprint, render_template, request
import enchant
from spellchecker import SpellChecker

pld = Blueprint("pig-latin-decoder", __name__, template_folder="templates")


@pld.route("/pig-latin-decoder", methods=["GET", "POST"])
def pig_latin_decoder():
    if request.method == "POST":
        # get the message and split it using regex
        results = {}
        punctuation = {"(", ")", ".", ",", "!", "?", ":", ";", "'", '"'}
        vowels = {"a", "e", "i", "o", "u", "y"}
        message = re.findall(r"\S+|\n", request.form["message"])
        digits = set()
        invalid = set()
        variations = set()
        d = enchant.Dict("en_US")
        spell = SpellChecker()
        # review each word
        for i, word in enumerate(message):
            if word == "\n":
                continue

            # Get prefix and suffix from punctuation
            j = -1
            prefix = word
            suffix = ""
            if word[j] in punctuation:
                print(word, "hello")
                while word[j] in punctuation:
                    j -= 1
                j += 1
                prefix = word[:j]
                suffix = word[j:]

            if prefix.find("'") > -1:
                j = prefix.find("'")
                print(j)
                suffix = prefix[j:] + suffix
                prefix = prefix[:j]

            # if it is a number, bail and add it to a set
            if not prefix.isalpha():
                digits.add(prefix)
                continue

            # if it doesn't contain "ay" or "way" at the end, bail and add it to a set
            if not prefix.endswith(("ay", "way")):
                invalid.add(word)
                continue

            uppercase = prefix.isupper()
            titlecase = prefix.istitle()

            if prefix.endswith("way"):
                candidate = prefix.removesuffix("way")
                if uppercase:
                    candidate = candidate.upper()
                if titlecase:
                    candidate = candidate.title()

                if d.check(candidate):
                    message[i] = candidate + suffix
                else:
                    candidate = prefix.removesuffix("ay")
                    print(candidate, "here")
                    k = 0
                    while not d.check(candidate) and k < len(candidate):
                        candidate = candidate[-1] + candidate[:-1]
                        if uppercase:
                            candidate = candidate.upper()
                        if titlecase:
                            candidate = candidate.title()
                        k += 1

                    if k == len(candidate):
                        invalid.add(word)
                    else:
                        message[i] = candidate + suffix
            else:
                candidate = prefix.removesuffix("ay")
                k = 0
                while not d.check(candidate) and k < len(candidate):
                    candidate = candidate[-1] + candidate[:-1]
                    if uppercase:
                        candidate = candidate.upper()
                    if titlecase:
                        candidate = candidate.title()
                    k += 1

                if k == len(candidate):
                    invalid.add(word)
                else:
                    message[i] = candidate + suffix

        results["decoded"] = " ".join(message)

        return render_template("bbospp/piglatindecoder.html.jinja", results=results)

    return render_template("bbospp/piglatindecoder.html.jinja")
